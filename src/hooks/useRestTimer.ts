import { useState, useRef, useCallback, useEffect } from 'react'

interface UseRestTimerReturn {
  secondsLeft: number
  isRunning: boolean
  progress: number        // 0 → 1, for the progress bar
  start: (duration: number) => void
  reset: () => void
  skip: () => void
}

export function useRestTimer(): UseRestTimerReturn {
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [duration, setDuration] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const restEndsAtRef = useRef<number | null>(null)   // deadline-based for accuracy

  // Clear on unmount
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    restEndsAtRef.current = null
  }, [])

  const start = useCallback((dur: number) => {
    clear()
    setDuration(dur)
    setSecondsLeft(dur)
    restEndsAtRef.current = Date.now() + dur * 1000

    intervalRef.current = setInterval(() => {
      if (!restEndsAtRef.current) return
      const remaining = Math.max(0, Math.ceil((restEndsAtRef.current - Date.now()) / 1000))
      setSecondsLeft(remaining)
      if (remaining === 0) clear()
    }, 500)   // 500ms tick is accurate enough and saves battery
  }, [clear])

  const reset = useCallback(() => {
    clear()
    setSecondsLeft(0)
    setDuration(0)
  }, [clear])

  const skip = useCallback(() => {
    clear()
    setSecondsLeft(0)
  }, [clear])

  return {
    secondsLeft,
    isRunning: secondsLeft > 0,
    progress: duration > 0 ? secondsLeft / duration : 0,
    start,
    reset,
    skip,
  }
}
