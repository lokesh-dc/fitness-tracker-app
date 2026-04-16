import React from 'react'
import { View, Text } from 'react-native'

interface TodayExercisePreview {
  exerciseId: string;
  name: string;
  targetSets: number;
  targetReps: number;
  lastWeight: number | null;
  lastUnit: 'kg' | 'lbs';
  restDuration: number;
}

interface ExercisePreviewCardProps {
  exercise: TodayExercisePreview;
}

export function ExercisePreviewCard({ exercise }: ExercisePreviewCardProps) {
  return (
    <View className="bg-zinc-800/60 border border-zinc-700/50 rounded-2xl p-4 mb-3">
      <Text className="text-white font-semibold text-lg mb-1">{exercise.name}</Text>
      <View className="flex-row items-center">
        <Text className="text-zinc-400 text-sm">
          {exercise.targetSets} sets × {exercise.targetReps} reps
        </Text>
        <Text className="text-zinc-500 text-sm mx-2">•</Text>
        {exercise.lastWeight ? (
          <Text className="text-zinc-400 text-sm">
            Last: {exercise.lastWeight}{exercise.lastUnit}
          </Text>
        ) : (
          <Text className="text-zinc-500 text-sm italic">No previous data</Text>
        )}
      </View>
    </View>
  )
}
