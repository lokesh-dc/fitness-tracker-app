export type WorkoutMode = 'LIVE_SESSION' | 'MANUAL_LOG'

export interface SetEntry {
  weight: string
  reps: string
  done: boolean
}

export interface SessionExercise {
  exerciseId: string
  name: string
  muscleGroup: string
  targetSets: number
  targetReps: number
  lastWeight: number    // pre-filled from last session, 0 if new
  currentPR: number     // from ExerciseRecords
  unit: 'kg' | 'lb'
  isDone: boolean;
  sets: SetEntry[];
  restDuration?: number; // seconds
}

export interface WorkoutSession {
  workoutName: string
  splitName: string
  bodyWeight: number | null
  exercises: SessionExercise[]
  startedAt: Date | null
  mode: WorkoutMode
}
