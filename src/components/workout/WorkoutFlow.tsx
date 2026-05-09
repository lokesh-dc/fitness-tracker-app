// Force cache invalidate
import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { SessionExercise, WorkoutMode, PlateauInfo, PRHit } from '../../types/workout';
import { BodyWeightStep } from './steps/BodyWeightStep';
import { ExerciseOverviewStep } from './steps/ExerciseOverviewStep';
import { ExerciseListStep } from './steps/ExerciseListStep';
import { ExerciseLogStep } from './steps/ExerciseLogStep';
import { WorkoutCompleteScreen } from './WorkoutCompleteScreen';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';

interface WorkoutFlowProps {
  initialExercises: SessionExercise[];
  lastBodyWeight: number | null;
  workoutName: string;
  unit: 'kg' | 'lb';
  mode: WorkoutMode;
  plateauData: Record<string, PlateauInfo>;
}

export const WorkoutFlow: React.FC<WorkoutFlowProps> = ({
  initialExercises,
  lastBodyWeight,
  workoutName,
  unit,
  mode,
  plateauData,
}) => {
  const { token } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [bodyWeight, setBodyWeight] = useState('');
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState<SessionExercise[]>(
    initialExercises.map(ex => ({
      ...ex,
      plateauInfo: plateauData?.[ex.exerciseId?.toString()] ?? null,
    }))
  );
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(mode === 'LIVE_SESSION');
  const [sessionPRs, setSessionPRs] = useState<PRHit[]>([]);
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [step]);

  const goNext = () => setStep(s => Math.min(s + 1, 4) as 1 | 2 | 3 | 4);
  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(s => (s - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleExerciseSaved = (updatedExercise: SessionExercise, prsHit: PRHit[]) => {
    const newExercises = [...exercises];
    newExercises[activeExerciseIndex] = updatedExercise;
    setExercises(newExercises);

    if (prsHit.length > 0) {
      setSessionPRs(prev => [...prev, ...prsHit]);
    }
  };

  const handleCompleteWorkout = async () => {
    if (isSaving) return;
    
    const validExercises = exercises.map(ex => ({
      ...ex,
      sets: ex.sets.filter(s => parseFloat(s.weight) > 0 && parseInt(s.reps) > 0)
    })).filter(ex => ex.sets.length > 0);

    if (validExercises.length === 0) {
      alert('Log at least one set before finishing.');
      return;
    }

    setIsSaving(true);
    const now = new Date();
    const durationSeconds = startedAt ? Math.floor((now.getTime() - startedAt.getTime()) / 1000) : 0;
    
    // Calculate total volume
    const totalVolume = validExercises.reduce((acc, ex) => {
      return acc + ex.sets.reduce((sAcc, s) => sAcc + (parseFloat(s.weight) * parseInt(s.reps)), 0);
    }, 0);

    const payload = {
      name: workoutName,
      date: now.toISOString().split('T')[0],
      exercises: validExercises,
      durationSeconds,
      startedAt: startedAt?.toISOString(),
      completedAt: now.toISOString(),
      bodyWeight: bodyWeight ? parseFloat(bodyWeight) : null,
    };

    try {
      await apiFetch('/api/logs', {
        method: 'POST',
        body: JSON.stringify(payload),
        token: token!,
      });

      setShowCompleteScreen(true);
    } catch (e: any) {
      alert(e.message || 'Failed to save workout');
    } finally {
      setIsSaving(false);
    }
  };

  if (showCompleteScreen) {
    return (
      <WorkoutCompleteScreen
        exercises={exercises}
        sessionPRs={sessionPRs}
        startedAt={startedAt}
        bodyWeight={bodyWeight}
        onDone={() => {
          setShowCompleteScreen(false);
          router.replace('/(tabs)/');
        }}
      />
    );
  }

  return (
    <View className="flex-1 bg-[#0a0a0a]">
      {step === 1 && (
        <ExerciseOverviewStep 
          workoutName={workoutName}
          exercises={exercises}
          isLive={isLive}
          setIsLive={setIsLive}
          goNext={goNext}
          handleBack={handleBack}
          setStartedAt={setStartedAt}
        />
      )}
      
      {step === 2 && (
        <BodyWeightStep 
          bodyWeight={bodyWeight}
          setBodyWeight={setBodyWeight}
          lastBodyWeight={lastBodyWeight}
          unit={unit}
          goNext={goNext}
          handleBack={handleBack}
        />
      )}

      {step === 3 && (
        <ExerciseListStep 
          workoutName={workoutName}
          exercises={exercises}
          setActiveExerciseIndex={setActiveExerciseIndex}
          setStep={setStep}
          handleBack={handleBack}
          onComplete={handleCompleteWorkout}
        />
      )}

      {step === 4 && (
        <ExerciseLogStep 
          exercise={exercises[activeExerciseIndex]}
          onSave={handleExerciseSaved}
          handleBack={handleBack}
        />
      )}
    </View>
  );
};
