import { View, Text, TouchableOpacity } from 'react-native'
import { Exercise, WorkingSet } from '@/types/workout'
import { WorkoutMode } from '@/types/workout'
import { SetRow } from './SetRow'
import { WarmupSetsPanel } from './WarmupSetsPanel'
import { PRBadge } from './PRBadge'
import { useRestTimer } from '@/hooks/useRestTimer'

interface Props {
  exercise: Exercise
  mode: WorkoutMode
  restTimer: ReturnType<typeof useRestTimer>
  onUpdateSet: (setIndex: number, updates: Partial<WorkingSet>) => void
  onSetDone: (setIndex: number) => void
  onAddSet: () => void
  onRemoveSet: (setIndex: number) => void
  onRemoveExercise: () => void
  onMarkDone: () => void
}

export function ExerciseCard({
  exercise, mode, restTimer,
  onUpdateSet, onSetDone, onAddSet, onRemoveSet,
  onRemoveExercise, onMarkDone,
}: Props) {
  const firstWorkingWeight = exercise.sets.find(s => s.weight > 0)?.weight
    ?? exercise.lastWeight

  return (
    <View className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-3">

      {/* Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center gap-2 flex-wrap">
            <Text className="text-white text-base font-medium">{exercise.name}</Text>
            {exercise.pr && <PRBadge />}
          </View>
          {exercise.muscleGroup && (
            <Text className="text-white/40 text-xs mt-0.5">{exercise.muscleGroup}</Text>
          )}
          <Text className="text-white/30 text-xs mt-1">
            {exercise.targetSets} × {exercise.targetReps} · last {exercise.lastWeight}{exercise.unit}
          </Text>
        </View>

        {/* Remove exercise button */}
        <TouchableOpacity
          onPress={onRemoveExercise}
          activeOpacity={0.7}
          className="w-8 h-8 items-center justify-center rounded-lg bg-white/5"
        >
          <Text className="text-white/30 text-base">×</Text>
        </TouchableOpacity>
      </View>

      {/* Warmup panel (only when first working weight is known) */}
      {firstWorkingWeight > 0 && (
        <WarmupSetsPanel
          workingWeight={firstWorkingWeight}
          targetReps={exercise.targetReps}
          unit={exercise.unit}
        />
      )}

      {/* Column headers */}
      <View className="flex-row items-center gap-3 px-1 mb-1">
        <Text className="text-white/25 text-xs w-5 text-center">#</Text>
        <Text className="text-white/25 text-xs flex-1 text-center">{exercise.unit}</Text>
        <Text className="text-white/25 text-xs flex-1 text-center">reps</Text>
        <Text className="text-white/25 text-xs w-10 text-center">done</Text>
      </View>

      {/* Sets */}
      {exercise.sets.map((set, i) => (
        <SetRow
          key={i}
          set={set}
          index={i}
          unit={exercise.unit}
          onUpdate={(updates) => onUpdateSet(i, updates)}
          onDone={() => onSetDone(i)}
        />
      ))}

      {/* Add / remove set row */}
      <View className="flex-row gap-2 mt-2">
        <TouchableOpacity
          onPress={onAddSet}
          activeOpacity={0.7}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 items-center"
        >
          <Text className="text-white/50 text-sm">+ Add set</Text>
        </TouchableOpacity>
        {exercise.sets.length > 1 && (
          <TouchableOpacity
            onPress={() => onRemoveSet(exercise.sets.length - 1)}
            activeOpacity={0.7}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 items-center"
          >
            <Text className="text-white/30 text-sm">− Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Mark exercise done */}
      {!exercise.isDone && exercise.sets.every(s => s.isDone) && (
        <TouchableOpacity
          onPress={onMarkDone}
          activeOpacity={0.8}
          className="mt-3 bg-primary/15 border border-primary/30 rounded-xl py-3 items-center"
        >
          <Text className="text-primary text-sm font-medium">Mark exercise done</Text>
        </TouchableOpacity>
      )}

      {exercise.isDone && (
        <View className="mt-3 py-2 items-center">
          <Text className="text-primary/60 text-xs">✓ Complete</Text>
        </View>
      )}
    </View>
  )
}
