import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

interface RestTimerBarProps {
  secondsRemaining: number;
  totalSeconds: number;
  onSkip: () => void;
  onAdjust: (delta: number) => void;
}

export const RestTimerBar: React.FC<RestTimerBarProps> = ({
  secondsRemaining,
  totalSeconds,
  onSkip,
  onAdjust,
}) => {
  const insets = useSafeAreaInsets();
  const slideAnim = React.useRef(new Animated.Value(200)).current;

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
  }, []);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = totalSeconds > 0 ? (secondsRemaining / totalSeconds) * 100 : 0;

  return (
    <Animated.View 
      className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a]/95 border-t border-white/10 px-6 pt-5 pb-8 z-50"
      style={{ 
        transform: [{ translateY: slideAnim }],
        paddingBottom: insets.bottom + 12 
      }}
    >
      <View className="items-center mb-6">
        <Text className={`text-4xl font-black mb-4 ${secondsRemaining <= 10 ? 'text-red-500' : 'text-white'}`}>
          {formatDuration(secondsRemaining)}
        </Text>
        
        {/* Fallback Linear Progress Bar */}
        <View className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <View 
            className="h-full bg-orange-500 rounded-full" 
            style={{ width: `${progress}%` }} 
          />
        </View>

        <Text className="text-white/40 text-[11px] mt-3 font-bold uppercase tracking-widest">
          Resting • {totalSeconds}s Total
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={() => onAdjust(-15)}
          className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex-row items-center"
        >
          <Ionicons name="remove-circle-outline" size={14} color="rgba(255,255,255,0.6)" className="mr-1" />
          <Text className="text-white/60 text-xs font-bold">15s</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={onSkip}
          className="px-6 py-2 flex-row items-center"
        >
          <Text className="text-orange-500 text-sm font-bold uppercase tracking-wider mr-1">Skip</Text>
          <Ionicons name="play-forward" size={14} color="#f97316" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => onAdjust(15)}
          className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex-row items-center"
        >
          <Text className="text-white/60 text-xs font-bold mr-1">15s</Text>
          <Ionicons name="add-circle-outline" size={14} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
