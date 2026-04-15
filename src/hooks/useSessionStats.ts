import { useState, useRef, useEffect, useCallback } from 'react'
import { Exercise } from '@/types/workout'

interface SessionStats {
  elapsedSeconds: number
  totalVolume: number       // kg or lbs, sum of weight × reps across all done sets
  setsCompleted: number
  exercisesDone: number
  prsHit: string[]          // exercise names that hit PRs this session
}

export function useSessionStats(exercises: Exercise[], isLive: boolean) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const startedAtRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Start timer on mount (LIVE_SESSION only)
  useEffect(() => {
    if (!isLive) return
    startedAtRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current!) / 1000))
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isLive])

  const stopTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  const stats: SessionStats = {
    elapsedSeconds,
    totalVolume: exercises.reduce((total, ex) =>
      total + ex.sets
        .filter(s => s.isDone && s.weight > 0 && s.reps > 0)
        .reduce((sum, s) => sum + s.weight * s.reps, 0)
    , 0),
    setsCompleted: exercises.reduce((n, ex) => n + ex.sets.filter(s => s.isDone).length, 0),
    exercisesDone: exercises.filter(ex => ex.isDone).length,
    prsHit: exercises.filter(ex => ex.pr).map(ex => ex.name),
  }

  return { stats, stopTimer, startedAt: startedAtRef.current }
}

export function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
