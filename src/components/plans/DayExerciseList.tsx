import { View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { PlanDay } from '@/types/plan'
import { Exercise } from '@/types/workout'

interface Props {
  day: PlanDay
  planName: string
}

// Convert PlanExercise → Exercise shape the workout screen expects
function toWorkoutExercise(pe: PlanDay['exercises'][number]): Exercise {
  return {
    exerciseId: pe.exerciseId,
    name: pe.name,
    muscleGroup: pe.muscleGroup,
    targetSets: pe.targetSets,
    targetReps: pe.targetReps,
    restDuration: pe.restDuration ?? 90,
    lastWeight: pe.lastWeight ?? 0,
    unit: pe.unit ?? 'kg',
    pr: false,
    isDone: false,
    sets: Array.from({ length: pe.targetSets }, () => ({
      weight: pe.lastWeight ?? 0,
      reps: 0,
      isDone: false,
    })),
  }
}

export function DayExerciseList({ day, planName }: Props) {
  function handleStartSession() {
    const exercises = day.exercises.map(toWorkoutExercise)
    // Pass exercises as a JSON param into the workout screen
    router.push({
      pathname: '/workout/new',
      params: {
        sessionName: `${planName} — ${day.name}`,
        exercises: JSON.stringify(exercises),
      },
    })
  }

  return (
    <View className="mx-4 mt-3">

      {/* Day header */}
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-white text-base font-medium">{day.name}</Text>
          <Text className="text-white/40 text-sm">
            {day.exercises.length} exercise{day.exercises.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleStartSession}
          activeOpacity={0.8}
          className="bg-primary rounded-xl px-4 py-2.5"
        >
          <Text className="text-white text-sm font-medium">Start session</Text>
        </TouchableOpacity>
      </View>

      {/* Exercise list */}
      {day.exercises.map((ex, i) => (
        <View
          key={i}
          className="flex-row items-center justify-between py-3 border-b border-white/5"
        >
          <View className="flex-1 mr-4">
            <Text className="text-white text-sm">{ex.name}</Text>
            {ex.muscleGroup && (
              <Text className="text-white/35 text-xs mt-0.5">{ex.muscleGroup}</Text>
            )}
          </View>
          <View className="items-end">
            <Text className="text-white/60 text-sm">
              {ex.targetSets} × {ex.targetReps}
            </Text>
            {ex.lastWeight > 0 && (
              <Text className="text-white/30 text-xs mt-0.5">
                last {ex.lastWeight}{ex.unit}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  )
}
