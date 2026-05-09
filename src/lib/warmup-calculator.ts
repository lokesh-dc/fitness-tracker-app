export type WarmupScheme = 'STRENGTH' | 'STRENGTH_HYPER' | 'HYPERTROPHY' | 'ENDURANCE'

export interface WarmupSet {
  setNumber: number
  percentage: number      // e.g. 0.4 for 40%
  weight: number          // rounded to nearest 2.5
  reps: number
}

export interface WarmupResult {
  scheme: WarmupScheme
  sets: WarmupSet[]
}

export function generateWarmupSets(
  workingWeight: number,
  targetReps: number,
  unit: 'kg' | 'lb'
): WarmupResult {
  let scheme: WarmupScheme = 'STRENGTH_HYPER'
  let percentages: number[] = []
  let repsPerSet = 5

  if (targetReps <= 5) {
    scheme = 'STRENGTH'
    percentages = [0.3, 0.5, 0.7, 0.9]
    repsPerSet = 5
  } else if (targetReps <= 10) {
    scheme = 'STRENGTH_HYPER'
    percentages = [0.4, 0.6, 0.8]
    repsPerSet = 5
  } else if (targetReps <= 15) {
    scheme = 'HYPERTROPHY'
    percentages = [0.5, 0.75]
    repsPerSet = 8
  } else {
    scheme = 'ENDURANCE'
    percentages = [0.6]
    repsPerSet = 10
  }

  if (workingWeight <= 0) {
    return { scheme, sets: [] }
  }

  const sets: WarmupSet[] = percentages
    .map((pct, index) => {
      const rawWeight = workingWeight * pct
      const roundedWeight = Math.round(rawWeight / 2.5) * 2.5
      
      return {
        setNumber: index + 1,
        percentage: pct,
        weight: roundedWeight,
        reps: repsPerSet
      }
    })
    .filter(set => set.weight > 0)

  return { scheme, sets }
}
