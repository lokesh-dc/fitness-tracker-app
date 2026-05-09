import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PlateauSessionEntry } from '../../types/workout';

interface PlateauBannerProps {
  history: PlateauSessionEntry[];
  onViewDetails: () => void;
  onDismiss: () => void;
}

export const PlateauBanner: React.FC<PlateauBannerProps> = ({
  history,
  onViewDetails,
  onDismiss,
}) => {
  return (
    <View 
      className="flex-row items-center justify-between rounded-lg p-3 w-full"
      style={{ 
        backgroundColor: 'rgba(234, 179, 8, 0.12)',
        borderLeftWidth: 3,
        borderLeftColor: '#eab308'
      }}
    >
      <View className="flex-row items-center flex-1">
        <Feather name="alert-triangle" size={16} color="#eab308" />
        <Text className="text-amber-200 text-[13px] ml-2 font-medium flex-1">
          No progress detected in last 3 sessions
        </Text>
        <TouchableOpacity onPress={onViewDetails} className="ml-2 mr-4">
          <Text className="text-amber-500 text-[13px] underline font-bold">Details</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onDismiss} className="p-1">
        <Feather name="x" size={16} color="rgba(234, 179, 8, 0.6)" />
      </TouchableOpacity>
    </View>
  );
};
