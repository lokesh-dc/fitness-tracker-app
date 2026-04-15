export type WorkoutMode = 'LIVE_SESSION' | 'MANUAL_LOG'

export type WarmupScheme = 'STRENGTH' | 'STRENGTH_HYPER' | 'HYPERTROPHY' | 'ENDURANCE'

export interface WarmupSet {
  percentage: number
  reps: number
  weight: number   // calculated from working weight
  isWarmup: true
}

export interface WorkingSet {
  weight: number
  reps: number
  isDone: boolean
  isWarmup?: false
}

export interface Exercise {
  exerciseId: string
  name: string
  muscleGroup?: string
  targetSets: number
  targetReps: number
  restDuration: number   // seconds, default 90
  lastWeight: number
  unit: 'kg' | 'lbs'
  pr: boolean            // true if any set in this session beats the PR
  sets: WorkingSet[]
  isDone: boolean
}

export interface WorkoutSession {
  name: string
  splitName?: string
  date: string           // ISO date string YYYY-MM-DD
  bodyWeight?: number
  exercises: Exercise[]
  startedAt?: string     // ISO timestamp, LIVE_SESSION only
  completedAt?: string
  durationSeconds?: number
  mode: WorkoutMode
}

export interface ExerciseMaster {
  _id: string
  name: string
  muscleGroup: string
}
