import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { generateWarmupSets } from '../../lib/warmup-calculator';
import { SessionExercise } from '../../types/workout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface WarmupBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  exercise: SessionExercise;
}

const SCHEME_COLORS = {
  STRENGTH: 'bg-orange-500',
  STRENGTH_HYPER: 'bg-amber-500',
  HYPERTROPHY: 'bg-indigo-500',
  ENDURANCE: 'bg-green-500',
};

export const WarmupBottomSheet: React.FC<WarmupBottomSheetProps> = ({
  visible,
  onClose,
  exercise,
}) => {
  const insets = useSafeAreaInsets();
  const warmup = useMemo(() => 
    generateWarmupSets(exercise.lastWeight, exercise.targetReps, exercise.unit),
    [exercise.lastWeight, exercise.targetReps, exercise.unit]
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/60">
        <View 
          className="bg-[#0a0a0a] rounded-t-[32px] border-t border-white/10"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}
        >
          {/* Drag Handle */}
          <View className="items-center pt-3 pb-2">
            <View className="w-12 h-1 bg-white/20 rounded-full" />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4">
            <View className="flex-row items-center gap-x-3">
              <View className={`${SCHEME_COLORS[warmup.scheme]} px-2 py-1 rounded`}>
                <Text className="text-white text-[10px] font-black uppercase">
                  {warmup.scheme.replace('_', ' ')}
                </Text>
              </View>
              <Text className="text-white text-lg font-bold">Warmup Sets</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
              <Feather name="x" size={24} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>
          </View>

          <ScrollView className="px-6">
            <View className="mb-4">
              <Text className="text-white/40 text-sm">
                Working weight: <Text className="text-white font-bold">{exercise.lastWeight} {exercise.unit}</Text>
              </Text>
            </View>

            {warmup.sets.length === 0 ? (
              <View className="py-12 items-center bg-white/5 rounded-2xl border border-white/5">
                <Feather name="info" size={24} color="rgba(255,255,255,0.2)" />
                <Text className="text-white/40 text-sm text-center mt-3 px-10">
                  Log a weight in your first set to generate warmup sets.
                </Text>
              </View>
            ) : (
              <View className="rounded-2xl overflow-hidden border border-white/5">
                {/* Table Header */}
                <View className="flex-row bg-white/10 py-3 px-4">
                  <Text className="w-8 text-white/40 text-[10px] font-black uppercase">#</Text>
                  <Text className="flex-1 text-white/40 text-[10px] font-black uppercase text-center">Weight</Text>
                  <Text className="flex-1 text-white/40 text-[10px] font-black uppercase text-center">Reps</Text>
                  <Text className="w-12 text-white/40 text-[10px] font-black uppercase text-right">%</Text>
                </View>

                {/* Table Rows */}
                {warmup.sets.map((set, index) => (
                  <View 
                    key={index} 
                    className={`flex-row py-4 px-4 ${index % 2 === 0 ? 'bg-white/[0.03]' : 'bg-white/[0.06]'}`}
                  >
                    <Text className="w-8 text-white/40 font-bold">{set.setNumber}</Text>
                    <Text className="flex-1 text-white font-bold text-center">
                      {set.weight} {exercise.unit}
                    </Text>
                    <Text className="flex-1 text-white font-medium text-center">{set.reps}</Text>
                    <Text className="w-12 text-white/40 text-sm text-right font-medium">
                      {Math.round(set.percentage * 100)}%
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Disclaimer */}
            <View className="flex-row items-center mt-6 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
              <Feather name="alert-triangle" size={14} color="#f59e0b" />
              <Text className="text-amber-500/80 text-[11px] ml-2 font-medium">
                Warmup sets are not saved to your log
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              className="bg-orange-500 rounded-2xl py-4 items-center mt-8 mb-4 shadow-lg shadow-orange-500/20"
            >
              <Text className="text-white text-base font-bold">Done Warming Up →</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
