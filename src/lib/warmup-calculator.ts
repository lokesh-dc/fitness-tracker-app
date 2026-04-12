import { WarmupSet, WarmupScheme } from '@/types/workout'

interface WarmupSchemeConfig {
  sets: { percentage: number; reps: number }[]
}

const SCHEMES: Record<WarmupScheme, WarmupSchemeConfig> = {
  STRENGTH:       { sets: [{ percentage: 30, reps: 5 }, { percentage: 50, reps: 3 }, { percentage: 70, reps: 2 }, { percentage: 90, reps: 1 }] },
  STRENGTH_HYPER: { sets: [{ percentage: 40, reps: 8 }, { percentage: 60, reps: 5 }, { percentage: 80, reps: 3 }] },
  HYPERTROPHY:    { sets: [{ percentage: 50, reps: 10 }, { percentage: 75, reps: 6 }] },
  ENDURANCE:      { sets: [{ percentage: 60, reps: 12 }] },
}

function getScheme(targetReps: number): WarmupScheme {
  if (targetReps <= 5)  return 'STRENGTH'
  if (targetReps <= 10) return 'STRENGTH_HYPER'
  if (targetReps <= 15) return 'HYPERTROPHY'
  return 'ENDURANCE'
}

export function generateWarmupSets(
  workingWeight: number,
  targetReps: number,
  unit: 'kg' | 'lbs'
): WarmupSet[] {
  if (workingWeight <= 0) return []
  const scheme = getScheme(targetReps)
  const config = SCHEMES[scheme]
  const step = unit === 'kg' ? 2.5 : 5

  return config.sets.map(({ percentage, reps }) => {
    const raw = workingWeight * (percentage / 100)
    const rounded = Math.round(raw / step) * step
    return { percentage, reps, weight: Math.max(rounded, step), isWarmup: true }
  })
}
