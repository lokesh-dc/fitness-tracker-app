import { useState, useCallback } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Exercise, WorkingSet, WorkoutMode, ExerciseMaster } from '@/types/workout'
import { useRestTimer } from '@/hooks/useRestTimer'
import { useSessionStats } from '@/hooks/useSessionStats'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/lib/api'
import { ExerciseCard } from './ExerciseCard'
import { RestTimerBar } from './RestTimerBar'
import { LiveStatsBar } from './LiveStatsBar'
import { CompletionModal } from './CompletionModal'
import { ExercisePickerModal } from './ExercisePickerModal'

interface Props {
  mode: WorkoutMode
  initialExercises?: Exercise[]
  sessionName?: string
}

function makeDefaultSets(targetSets: number, lastWeight: number): WorkingSet[] {
  return Array.from({ length: targetSets }, () => ({
    weight: lastWeight,
    reps: 0,
    isDone: false,
  }))
}

function exerciseFromMaster(master: ExerciseMaster): Exercise {
  return {
    exerciseId: master._id,
    name: master.name,
    muscleGroup: master.muscleGroup,
    targetSets: 3,
    targetReps: 8,
    restDuration: 90,
    lastWeight: 0,
    unit: 'kg',
    pr: false,
    sets: makeDefaultSets(3, 0),
    isDone: false,
  }
}

export function WorkoutScreen({ mode, initialExercises = [], sessionName = 'Workout' }: Props) {
  const { token } = useAuth()
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises)
  const [isSaving, setIsSaving] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [completionData, setCompletionData] = useState<{
    volume: number; duration: number; prs: string[]
  } | null>(null)

  const restTimer = useRestTimer()
  const isLive = mode === 'LIVE_SESSION'
  const { stats, stopTimer, startedAt } = useSessionStats(exercises, isLive)

  // --- Exercise mutations ---

  const updateSet = useCallback((exIndex: number, setIndex: number, updates: Partial<WorkingSet>) => {
    setExercises(prev => prev.map((ex, ei) => {
      if (ei !== exIndex) return ex
      const sets = ex.sets.map((s, si) => si === setIndex ? { ...s, ...updates } : s)
      return { ...ex, sets }
    }))
  }, [])

  const markSetDone = useCallback((exIndex: number, setIndex: number) => {
    setExercises(prev => prev.map((ex, ei) => {
      if (ei !== exIndex) return ex
      const set = ex.sets[setIndex]

      // Validate — don't mark done if weight/reps are 0
      if (set.weight <= 0 || set.reps <= 0) return ex

      const sets = ex.sets.map((s, si) =>
        si === setIndex ? { ...s, isDone: !s.isDone } : s
      )

      // PR detection: check if any done set beats lastWeight
      const pr = sets.some(s => s.isDone && s.weight > ex.lastWeight)

      const updatedEx = { ...ex, sets, pr }

      // Start rest timer only in LIVE_SESSION after marking done (not undone)
      if (isLive && !set.isDone) {
        restTimer.start(ex.restDuration)
      }

      return updatedEx
    }))
  }, [isLive, restTimer])

  const addSet = useCallback((exIndex: number) => {
    setExercises(prev => prev.map((ex, ei) => {
      if (ei !== exIndex) return ex
      const lastSet = ex.sets[ex.sets.length - 1]
      const newSet: WorkingSet = { weight: lastSet?.weight ?? 0, reps: lastSet?.reps ?? 0, isDone: false }
      return { ...ex, sets: [...ex.sets, newSet] }
    }))
  }, [])

  const removeSet = useCallback((exIndex: number, setIndex: number) => {
    setExercises(prev => prev.map((ex, ei) => {
      if (ei !== exIndex) return ex
      const sets = ex.sets.filter((_, si) => si !== setIndex)
      return { ...ex, sets }
    }))
  }, [])

  const markExerciseDone = useCallback((exIndex: number) => {
    setExercises(prev => prev.map((ex, ei) =>
      ei === exIndex ? { ...ex, isDone: true } : ex
    ))
  }, [])

  const removeExercise = useCallback((exIndex: number) => {
    Alert.alert(
      'Remove exercise',
      `Remove ${exercises[exIndex].name} from this session?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setExercises(prev => prev.filter((_, ei) => ei !== exIndex)),
        },
      ]
    )
  }, [exercises])

  const addExerciseFromMaster = useCallback((master: ExerciseMaster) => {
    setExercises(prev => [...prev, exerciseFromMaster(master)])
  }, [])

  // --- Save ---

  async function handleFinish() {
    const validExercises = exercises.map(ex => ({
      ...ex,
      sets: ex.sets.filter(s => s.weight > 0 && s.reps > 0),   // never save zero-weight sets
    })).filter(ex => ex.sets.length > 0)

    if (validExercises.length === 0) {
      Alert.alert('No sets logged', 'Log at least one set before finishing.')
      return
    }

    stopTimer()
    setIsSaving(true)

    const now = new Date()
    const payload = {
      name: sessionName,
      date: now.toISOString().split('T')[0],
      exercises: validExercises,
      ...(isLive && startedAt ? {
        startedAt: new Date(startedAt).toISOString(),
        completedAt: now.toISOString(),
        durationSeconds: stats.elapsedSeconds,
      } : {}),
    }

    try {
      await apiFetch('/api/logs', {
        method: 'POST',
        body: JSON.stringify(payload),
        token: token!,
      })

      setCompletionData({
        volume: stats.totalVolume,
        duration: stats.elapsedSeconds,
        prs: stats.prsHit,
      })
      setShowCompletion(true)
    } catch (e: any) {
      Alert.alert('Failed to save', e.message ?? 'Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const unit = exercises[0]?.unit ?? 'kg'

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >

        {/* Header */}
        <View className="flex-row items-center justify-[between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text className="text-white/50 text-base">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-base font-medium">{sessionName}</Text>
          <View className="w-16" />
        </View>

        {/* Live stats bar (LIVE_SESSION only) */}
        {isLive && (
          <LiveStatsBar
            elapsedSeconds={stats.elapsedSeconds}
            totalVolume={stats.totalVolume}
            setsCompleted={stats.setsCompleted}
            unit={unit}
          />
        )}

        {/* Rest timer bar (LIVE_SESSION only) */}
        {isLive && <RestTimerBar restTimer={restTimer} />}

        {/* Exercise list */}
        <ScrollView
          className="flex-1 px-4"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {exercises.length === 0 && (
            <View className="items-center py-16">
              <Text className="text-white/30 text-base">No exercises yet</Text>
              <Text className="text-white/20 text-sm mt-1">Tap + below to add one</Text>
            </View>
          )}

          {exercises.map((exercise, exIndex) => (
            <ExerciseCard
              key={`${exercise.exerciseId}-${exIndex}`}
              exercise={exercise}
              mode={mode}
              restTimer={restTimer}
              onUpdateSet={(si, updates) => updateSet(exIndex, si, updates)}
              onSetDone={(si) => markSetDone(exIndex, si)}
              onAddSet={() => addSet(exIndex)}
              onRemoveSet={(si) => removeSet(exIndex, si)}
              onRemoveExercise={() => removeExercise(exIndex)}
              onMarkDone={() => markExerciseDone(exIndex)}
            />
          ))}
        </ScrollView>

        {/* Bottom action bar */}
        <View className="absolute bottom-0 left-0 right-0 bg-black/95 border-t border-white/8 px-4 pt-3 pb-8">
          <View className="flex-row gap-3">
            {/* Add exercise */}
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              activeOpacity={0.7}
              className="bg-white/5 border border-white/10 rounded-xl py-4 px-5 items-center"
            >
              <Text className="text-white/60 text-base">+ Exercise</Text>
            </TouchableOpacity>

            {/* Finish */}
            <TouchableOpacity
              onPress={handleFinish}
              disabled={isSaving}
              activeOpacity={0.8}
              className="flex-1 bg-primary rounded-xl py-4 items-center"
              style={{ opacity: isSaving ? 0.7 : 1 }}
            >
              <Text className="text-white text-base font-medium">
                {isSaving ? 'Saving...' : 'Finish session'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modals */}
        <CompletionModal
          visible={showCompletion}
          totalVolume={completionData?.volume ?? 0}
          durationSeconds={completionData?.duration ?? 0}
          prsHit={completionData?.prs ?? []}
          unit={unit}
          onDone={() => { setShowCompletion(false); router.replace('/(tabs)/') }}
        />

        <ExercisePickerModal
          visible={showPicker}
          onClose={() => setShowPicker(false)}
          onSelect={addExerciseFromMaster}
        />

      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
