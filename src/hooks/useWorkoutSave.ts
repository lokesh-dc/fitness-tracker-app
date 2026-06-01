import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { WorkoutSession, SaveWorkoutPayload, ExerciseOneRM, SaveWorkoutResponse } from '../types/workout';
import { saveWorkoutSession } from '../lib/api/workout';

interface UseWorkoutSaveReturn {
  save: (session: WorkoutSession) => Promise<void>;
  isSaving: boolean;
  error: string | null;
  savedLogId: string | null;
  oneRepMaxes: Record<string, ExerciseOneRM>;
}

export function useWorkoutSave(): UseWorkoutSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedLogId, setSavedLogId] = useState<string | null>(null);
  const [oneRepMaxes, setOneRepMaxes] = useState<Record<string, ExerciseOneRM>>({});
  const { token } = useAuth();

  const save = async (session: WorkoutSession) => {
    if (!token) {
      setError('You must be logged in to save workouts');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = buildPayload(session);
      const result = await saveWorkoutSession(payload, token);

      if (result.success) {
        setSavedLogId(result.workoutLogId ?? null);
        if (result.oneRepMaxes) {
          setOneRepMaxes(result.oneRepMaxes);
        }
      } else {
        setError(result.error ?? 'Something went wrong');
      }
    } catch (err) {
      setError('Network error — check your connection');
    } finally {
      setIsSaving(false);
    }
  };

  return { save, isSaving, error, savedLogId, oneRepMaxes };
}

function buildPayload(session: WorkoutSession): SaveWorkoutPayload {
  const completedAt = new Date();
  const startedAt = session.startedAt || new Date();

  return {
    workoutName: session.workoutName,
    splitName: session.splitName,
    bodyWeight: session.bodyWeight ?? null,
    startedAt: startedAt.toISOString(),
    completedAt: completedAt.toISOString(),
    durationSeconds: Math.round((completedAt.getTime() - startedAt.getTime()) / 1000),
    exercises: session.exercises
      .filter(ex => ex.isDone || ex.isSkipped)
      .map(ex => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        targetSets: ex.targetSets,
        targetReps: ex.targetReps,
        unit: ex.unit,
        isDone: !!ex.isDone,
        isSkipped: !!ex.isSkipped,
        sets: ex.isSkipped 
          ? [] 
          : ex.sets
              .filter(s => s.done && parseFloat(s.weight) > 0 && parseInt(s.reps) > 0)
              .map(s => ({
                weight: parseFloat(s.weight),
                reps: parseInt(s.reps),
                done: true,
              })),
      }))
      .filter(ex => ex.isSkipped || ex.sets.length > 0),
  };
}
