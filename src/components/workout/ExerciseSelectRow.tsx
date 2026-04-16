import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export interface ExerciseListItem {
  exerciseId: string;
  name: string;
  muscleGroup: string;
}

interface ExerciseSelectRowProps {
  exercise: ExerciseListItem;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function ExerciseSelectRow({ exercise, selected, disabled, onToggle }: ExerciseSelectRowProps) {
  const containerClass = selected
    ? "bg-orange-500/10 border border-orange-500/40 rounded-xl p-4 mb-3 flex-row items-center justify-between"
    : "bg-zinc-800/40 border border-zinc-700/30 rounded-xl p-4 mb-3 flex-row items-center justify-between";

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onToggle}
      disabled={disabled}
      className={`${containerClass} ${disabled ? 'opacity-50' : ''}`}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-6 h-6 rounded-full border border-zinc-600 items-center justify-center mr-3 bg-zinc-900/50">
          {selected && <Text className="text-orange-500 text-xs text-center leading-none" style={{ marginTop: -2 }}>✓</Text>}
        </View>
        <Text className="text-white font-medium flex-1">{exercise.name}</Text>
      </View>
      <View className="bg-zinc-700 rounded-full px-3 py-1">
        <Text className="text-zinc-300 text-xs">{exercise.muscleGroup}</Text>
      </View>
    </TouchableOpacity>
  )
}
