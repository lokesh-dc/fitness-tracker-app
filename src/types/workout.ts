export type WorkoutMode = 'LIVE_SESSION' | 'MANUAL_LOG'

export interface SetEntry {
  weight: string
  reps: string
  done: boolean
}

export interface PlateauSessionEntry {
  date: string        // ISO date string
  maxWeight: number
  maxReps: number
}

export interface PlateauInfo {
  isPlateaued: boolean
  history: PlateauSessionEntry[]   // up to 5 most recent sessions
}

export interface PRHit {
  exerciseId: string
  exerciseName: string
  type: 'WEIGHT' | 'REPS'
  newValue: number        // new max weight or new max reps
  previousValue: number  // what was beaten
  setWeight: number       // the actual set weight (for display)
  setReps: number         // the actual set reps (for display)
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
  currentPRReps: number        // max reps at current PR weight, 0 if no PR
  plateauInfo: PlateauInfo | null
}

export interface WorkoutSession {
  workoutName: string
  splitName: string
  bodyWeight: number | null
  exercises: SessionExercise[]
  startedAt: Date | null
  mode: WorkoutMode
}
