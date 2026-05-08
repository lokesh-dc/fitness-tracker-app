import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StickyBottomBar } from '../shared/StickyBottomBar';
import { StepIndicator } from '../shared/StepIndicator';
import { ExerciseRowCard } from '../shared/ExerciseRowCard';
import { SessionExercise } from '../../../types/workout';

interface ExerciseListStepProps {
  workoutName: string;
  exercises: SessionExercise[];
  setActiveExerciseIndex: (index: number) => void;
  setStep: (step: 1 | 2 | 3 | 4) => void;
  handleBack: () => void;
  onComplete: () => void;
}

export const ExerciseListStep: React.FC<ExerciseListStepProps> = ({
  workoutName,
  exercises,
  setActiveExerciseIndex,
  setStep,
  handleBack,
  onComplete,
}) => {
  const doneCount = exercises.filter(e => e.isDone).length;
  const progress = exercises.length > 0 ? doneCount / exercises.length : 0;

  const handleStartExercise = (index: number) => {
    setActiveExerciseIndex(index);
    setStep(4);
  };

  return (
    <View className="flex-1 bg-[#0a0a0a]">
      <View className="px-6 pt-4">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
            <Feather name="chevron-left" color="white" size={24} />
          </TouchableOpacity>
          <StepIndicator currentStep={3} />
          <View className="w-10" />
        </View>
        
        <View className="mb-6">
          <Text className="text-white text-3xl font-bold mb-1">
            {workoutName}
          </Text>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white/40 font-medium">
              {doneCount}/{exercises.length} exercises done
            </Text>
            <Text className="text-orange-500 font-bold text-xs">
              {Math.round(progress * 100)}%
            </Text>
          </View>
          
          <View className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <View 
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
          </View>
        </View>
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item, index) => `${item.exerciseId}-${index}`}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 150 }}
        renderItem={({ item, index }) => (
          <ExerciseRowCard 
            exercise={item} 
            variant={item.isDone ? 'done' : 'list'} 
            onStart={() => handleStartExercise(index)}
          />
        )}
      />

      <StickyBottomBar
        primaryLabel="Complete Workout"
        onPrimary={onComplete}
        primaryDisabled={doneCount === 0}
      />
    </View>
  );
};
