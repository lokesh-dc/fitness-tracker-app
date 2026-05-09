import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SessionExercise } from '../../../types/workout';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ExerciseRowCardProps {
  exercise: SessionExercise;
  variant: 'preview' | 'list' | 'done';
  onStart?: () => void;
}

export const ExerciseRowCard: React.FC<ExerciseRowCardProps> = ({
  exercise,
  variant,
  onStart,
}) => {
  const isDone = variant === 'done';

  return (
    <View 
      className={`mb-4 p-4 rounded-xl border border-white/10 bg-white/5 ${
        isDone ? 'opacity-50' : ''
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <View className="flex-row items-center gap-x-2">
              {exercise.currentPR > 0 && variant === 'preview' && (
                <View className="bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded">
                  <Text className="text-orange-500 text-[8px] font-black uppercase">PR</Text>
                </View>
              )}
              <Text className="text-white font-bold text-base">
                {exercise.name}
              </Text>
            </View>
            
            {variant === 'preview' && (
              <Text className="text-white/60 text-sm font-bold">
                {exercise.lastWeight > 0 ? `${exercise.lastWeight} ${exercise.unit}` : '-'}
              </Text>
            )}
          </View>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-x-4">
              <Text className="text-white/40 text-xs font-medium uppercase tracking-wider">
                {exercise.targetSets} × {exercise.targetReps}
              </Text>
              {variant !== 'preview' && (
                <Text className="text-white/40 text-xs font-medium">
                  Last: <Text className="text-white/60">{exercise.lastWeight > 0 ? `${exercise.lastWeight} ${exercise.unit}` : 'New'}</Text>
                </Text>
              )}
            </View>

            {variant === 'list' && (
              <TouchableOpacity
                onPress={onStart}
                activeOpacity={0.7}
                className="bg-orange-500 px-4 py-2 rounded-lg flex-row items-center"
              >
                <Text className="text-white font-bold text-xs mr-1">Start</Text>
                <Ionicons name="chevron-forward" size={14} color="white" />
              </TouchableOpacity>
            )}

            {isDone && (
              <View className="bg-green-500/20 p-2 rounded-full border border-green-500/30">
                <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
