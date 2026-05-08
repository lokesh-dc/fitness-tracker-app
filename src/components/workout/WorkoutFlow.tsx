import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { SessionExercise, WorkoutMode } from '../../types/workout';
import { BodyWeightStep } from './steps/BodyWeightStep';
import { ExerciseOverviewStep } from './steps/ExerciseOverviewStep';
import { ExerciseListStep } from './steps/ExerciseListStep';
import { ExerciseLogStep } from './steps/ExerciseLogStep';
import { CompletionModal } from './CompletionModal';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';

interface WorkoutFlowProps {
  initialExercises: SessionExercise[];
  lastBodyWeight: number | null;
  workoutName: string;
  unit: 'kg' | 'lb';
  mode: WorkoutMode;
}

export const WorkoutFlow: React.FC<WorkoutFlowProps> = ({
  initialExercises,
  lastBodyWeight,
  workoutName,
  unit,
  mode,
}) => {
  const { token } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [bodyWeight, setBodyWeight] = useState('');
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState<SessionExercise[]>(initialExercises);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(mode === 'LIVE_SESSION');
  const [showCompletion, setShowCompletion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [completionStats, setCompletionStats] = useState({ volume: 0, duration: 0, prs: [] as string[] });

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

  const handleUpdateExercise = (updatedExercise: SessionExercise) => {
    const newExercises = [...exercises];
    newExercises[activeExerciseIndex] = updatedExercise;
    setExercises(newExercises);
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

      setCompletionStats({
        volume: totalVolume,
        duration: durationSeconds,
        prs: exercises.filter(e => e.sets.some(s => parseFloat(s.weight) > e.lastWeight)).map(e => e.name)
      });
      setShowCompletion(true);
    } catch (e: any) {
      alert(e.message || 'Failed to save workout');
    } finally {
      setIsSaving(false);
    }
  };

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
          onSave={handleUpdateExercise}
          handleBack={handleBack}
        />
      )}

      <CompletionModal 
        visible={showCompletion}
        totalVolume={completionStats.volume}
        durationSeconds={completionStats.duration}
        prsHit={completionStats.prs}
        unit={unit}
        onDone={() => {
          setShowCompletion(false);
          router.replace('/(tabs)/');
        }}
      />
    </View>
  );
};
