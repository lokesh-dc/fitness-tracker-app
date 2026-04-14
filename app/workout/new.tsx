import { useLocalSearchParams } from 'expo-router'
import { WorkoutScreen } from '@/components/workout/WorkoutScreen'
import { Exercise } from '@/types/workout'

export default function NewWorkoutScreen() {
  const { sessionName, exercises: exercisesParam } = useLocalSearchParams<{
    sessionName?: string
    exercises?: string
  }>()

  let initialExercises: Exercise[] = []
  if (exercisesParam) {
    try {
      initialExercises = JSON.parse(exercisesParam)
    } catch {}
  }

  return (
    <WorkoutScreen
      mode="LIVE_SESSION"
      sessionName={sessionName ?? "Today's workout"}
      initialExercises={initialExercises}
    />
  )
}
