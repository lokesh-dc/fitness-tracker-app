import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StreakData } from '@/hooks/useHomeData';

interface Props {
  data: StreakData;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function StreakWidget({ data }: Props) {
  return (
    <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <Text className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
        Streak
      </Text>
      <View className="flex-row gap-4">
        <View className="flex-1 bg-white/5 rounded-xl py-3 items-center">
          <View className="flex-row items-center gap-1 mb-1">
            <Ionicons name="flame" size={18} color="#f97316" />
            <Text className="text-orange-500 text-2xl font-bold">{data.currentStreak}</Text>
          </View>
          <Text className="text-white/30 text-[12px] uppercase tracking-wider font-semibold">
            Current
          </Text>
        </View>
        <View className="flex-1 bg-white/5 rounded-xl py-3 items-center">
          <View className="flex-row items-center gap-1 mb-1">
            <Ionicons name="trophy" size={18} color="rgba(255,255,255,0.4)" />
            <Text className="text-white text-2xl font-bold">{data.longestStreak}</Text>
          </View>
          <Text className="text-white/30 text-[12px] uppercase tracking-wider font-semibold">
            Best
          </Text>
        </View>
      </View>
      {data.lastWorkoutDate && (
        <Text className="text-white/20 text-[12px] text-center mt-2 uppercase tracking-wider">
          Last: {data.lastWorkoutDate}
        </Text>
      )}
    </View>
  );
}
