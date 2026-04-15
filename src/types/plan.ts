export type PlanStatus = 'active' | 'draft' | 'completed'

export interface PlanExercise {
  exerciseId: string
  name: string
  muscleGroup?: string
  targetSets: number
  targetReps: number
  restDuration: number    // seconds, default 90
  lastWeight: number
  unit: 'kg' | 'lbs'
}

export interface PlanDay {
  dayOfWeek: number       // 0 = Monday … 6 = Sunday (matches web app)
  name: string            // e.g. "Push", "Pull", "Legs"
  exercises: PlanExercise[]
}

export interface Plan {
  _id: string
  name: string
  status: PlanStatus
  days: PlanDay[]
  startDate?: string      // ISO date string
  endDate?: string
  weeksCount: number
  createdAt: string
}
