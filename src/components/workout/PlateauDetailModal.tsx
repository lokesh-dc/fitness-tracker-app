import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PlateauSessionEntry } from '../../types/workout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PlateauDetailModalProps {
  visible: boolean;
  exerciseName: string;
  history: PlateauSessionEntry[];
  onClose: () => void;
}

export const PlateauDetailModal: React.FC<PlateauDetailModalProps> = ({
  visible,
  exerciseName,
  history,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isWeightPlateau = history.length >= 3 && 
    history[0].maxWeight === history[1].maxWeight && 
    history[1].maxWeight === history[2].maxWeight;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/60">
        <View 
          className="bg-[#111111] rounded-t-[20px]"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}
        >
          {/* Drag Handle */}
          <View className="items-center pt-3 pb-2">
            <View className="w-12 h-1 bg-white/20 rounded-full" />
          </View>

          {/* Header */}
          <View className="px-6 py-4 mb-2">
            <View className="flex-row items-center gap-x-2">
              <Feather 
                name={isWeightPlateau ? "alert-triangle" : "clock"} 
                size={18} 
                color={isWeightPlateau ? "#eab308" : "#ffffff"} 
              />
              <Text className="text-white text-lg font-bold">
                {isWeightPlateau ? "Plateau Detected" : "Exercise History"}
              </Text>
            </View>
            <Text className="text-white/60 text-sm mt-1">{exerciseName}</Text>
          </View>

          <ScrollView className="px-6">
            {/* Table */}
            <View className="rounded-xl overflow-hidden border border-white/10 mb-6">
              <View className="flex-row bg-white/5 py-3 px-4">
                <Text className="flex-1 text-white/40 text-[11px] font-bold uppercase tracking-widest">Date</Text>
                <Text className="flex-1 text-white/40 text-[11px] font-bold uppercase tracking-widest text-center">Max Weight</Text>
                <Text className="flex-1 text-white/40 text-[11px] font-bold uppercase tracking-widest text-center">Max Reps</Text>
              </View>

              {history.map((entry, index) => {
                const isRecentThree = index < 3;
                const highlightWeight = isRecentThree && isWeightPlateau;

                return (
                  <View 
                    key={index} 
                    className={`flex-row py-3 px-4 items-center border-t border-white/5 ${index % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}`}
                  >
                    <Text className="flex-1 text-white/80 font-medium">{formatDate(entry.date)}</Text>
                    <View className={`flex-1 py-1 rounded ${highlightWeight ? 'bg-amber-500/20' : ''}`}>
                      <Text className="text-white font-bold text-center">{entry.maxWeight}</Text>
                    </View>
                    <Text className="flex-1 text-white font-medium text-center">{entry.maxReps}</Text>
                  </View>
                );
              })}
            </View>



            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              className="bg-orange-500 rounded-2xl py-4 items-center mb-4"
            >
              <Text className="text-white text-base font-bold">Got it</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
