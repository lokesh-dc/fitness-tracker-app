import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
}

export interface WeekSnapshotData {
  sessionsCompleted: number;
  sessionsPlanned: number;
  completedDays: number[];
  plannedDays: number[];
}

export interface NextWorkoutDetail {
  name: string;
  targetSets: number;
  targetReps: number;
  unit?: string;
}

export interface NextWorkoutData {
  name: string;
  scheduledDay: string;
  exercises: string[];
  totalExercises: number;
  detail: NextWorkoutDetail[];
}

export interface HomeData {
  streak: StreakData;
  monthDates: string[];
  weekSnapshot: WeekSnapshotData;
  nextWorkout: NextWorkoutData | null;
}

interface UseHomeDataReturn {
  data: HomeData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useHomeData(): UseHomeDataReturn {
  const { token } = useAuth();
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<HomeData>(
        '/api/mobile/home',
        { token }
      );
      setData(response);
    } catch (err: any) {
      setError(err.message || 'Failed to load home data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { data, loading, error, refetch };
}
