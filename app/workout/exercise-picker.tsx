import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, SafeAreaView, Platform, StatusBar } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { ExerciseSelectRow, ExerciseListItem } from '@/components/workout/ExerciseSelectRow'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function ExercisePickerScreen() {
  const { mode, existingPlan } = useLocalSearchParams<{ mode?: string; existingPlan?: string }>()
  const { token } = useAuth()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All')
  const [exercises, setExercises] = useState<ExerciseListItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // existing exercises IDs so we don't pick them again
  const [existingIds, setExistingIds] = useState<Set<string>>(new Set())
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (mode === 'addToExisting' && existingPlan) {
      try {
        const plan = JSON.parse(existingPlan)
        const ids = new Set<string>(plan.exercises.map((e: any) => e.exerciseId))
        setExistingIds(ids)
      } catch (e) {}
    }

    const fetchExercises = async () => {
      try {
        const data = await apiFetch<{ exercises: ExerciseListItem[] }>('/api/mobile/exercises', {
          token: token ?? undefined
        })
        setExercises(data.exercises)
      } catch (e) {
        console.error('Failed fetching exercises', e)
      } finally {
        setLoading(false)
      }
    }
    fetchExercises()
  }, [mode, existingPlan, token])

  const toggleExercise = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIds(newSet)
  }

  const handleStartSession = () => {
    const selectedExList = exercises.filter(e => selectedIds.has(e.exerciseId))
    
    let initialExercises: any[] = []
    let sessionName = "Custom Session"
    
    if (mode === 'addToExisting' && existingPlan) {
      const planDay = JSON.parse(existingPlan)
      sessionName = planDay.dayName
      
      const planExercises = planDay.exercises.map((ex: any) => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        targetSets: ex.targetSets,
        targetReps: ex.targetReps,
        lastWeight: ex.lastWeight ?? 0,
        unit: ex.lastUnit ?? 'kg',
        restDuration: ex.restDuration ?? 90,
        sets: Array.from({ length: ex.targetSets }, () => ({
          weight: ex.lastWeight ?? 0,
          reps: ex.targetReps,
          done: false
        }))
      }))
      
      const extraExercises = selectedExList.map(ex => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        targetSets: 3,
        targetReps: 10,
        lastWeight: 0,
        unit: 'kg',
        restDuration: 90,
        sets: [
          { weight: 0, reps: 10, done: false },
          { weight: 0, reps: 10, done: false },
          { weight: 0, reps: 10, done: false }
        ]
      }))
      
      initialExercises = [...planExercises, ...extraExercises]
    } else {
      initialExercises = selectedExList.map(ex => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        targetSets: 3,
        targetReps: 10,
        lastWeight: 0,
        unit: 'kg',
        restDuration: 90,
        sets: [
          { weight: 0, reps: 10, done: false },
          { weight: 0, reps: 10, done: false },
          { weight: 0, reps: 10, done: false }
        ]
      }))
    }

    router.replace({
      pathname: '/workout/new',
      params: { 
        exercises: JSON.stringify(initialExercises),
        sessionName
      }
    })
  }

  const muscleGroups = ['All', ...Array.from(new Set(exercises.map(e => e.muscleGroup))).filter(Boolean).sort()]

  const filteredExercises = exercises.filter(e => {
    if (selectedMuscle !== 'All' && e.muscleGroup !== selectedMuscle) return false
    if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#18181b', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Text className="text-white text-xl">←</Text>
        </TouchableOpacity>
      </View>

      <View className="px-4 pb-4">
        <Text className="text-white text-3xl font-bold mb-1">Choose Exercises</Text>
        <Text className="text-zinc-400 mb-6">
          {mode === 'addToExisting' ? 'Add extra exercises to your plan' : 'No plan today — build your own session'}
        </Text>

        <View className="bg-zinc-800 rounded-xl flex-row items-center px-4 py-3 mb-4">
          <Text className="text-zinc-400 text-lg">🔍</Text>
          <TextInput
            placeholder="Search exercises..."
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-3 text-white"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          {muscleGroups.map(group => (
            <TouchableOpacity
              key={group}
              onPress={() => setSelectedMuscle(group)}
              activeOpacity={0.7}
              className={`mr-2 px-4 py-2 rounded-full ${selectedMuscle === group ? 'bg-orange-500' : 'bg-zinc-800'}`}
            >
              <Text className={`font-medium ${selectedMuscle === group ? 'text-white' : 'text-zinc-400'}`}>
                {group}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4">
        {loading ? (
          <ActivityIndicator color="#f97316" className="mt-8" />
        ) : (
          filteredExercises.map(ex => (
            <ExerciseSelectRow
              key={ex.exerciseId}
              exercise={ex}
              selected={selectedIds.has(ex.exerciseId)}
              disabled={existingIds.has(ex.exerciseId)}
              onToggle={() => toggleExercise(ex.exerciseId)}
            />
          ))
        )}
        <View className="h-24" />
      </ScrollView>

      {selectedIds.size > 0 && (
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800">
          <TouchableOpacity
            onPress={handleStartSession}
            activeOpacity={0.8}
            className="bg-orange-500 py-4 rounded-xl items-center flex-row justify-center"
          >
            <Text className="text-white font-bold text-lg">Start Session ({selectedIds.size})</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}
