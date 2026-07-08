import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NextWorkoutData } from '@/hooks/useHomeData';

interface Props {
  data: NextWorkoutData | null;
}

export default function NextWorkoutWidget({ data }: Props) {
  if (!data) {
    return (
      <TouchableOpacity
        onPress={() => router.push('/plans')}
        activeOpacity={0.7}
        className="bg-white/5 border border-white/10 rounded-2xl p-4"
      >
        <Text className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
          Next Workout
        </Text>
        <View className="items-center py-3">
          <Ionicons name="calendar-outline" size={28} color="rgba(255,255,255,0.2)" />
          <Text className="text-white/30 text-sm mt-2 text-center">
            No active plan
          </Text>
          <Text className="text-orange-500 text-xs mt-1 font-medium">
            Create a plan
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  const isToday = data.scheduledDay === 'Today';
  const isTomorrow = data.scheduledDay === 'Tomorrow';

  return (
    <TouchableOpacity
      onPress={() => router.push('/workout/today-preview')}
      activeOpacity={0.7}
      className="bg-white/5 border border-white/10 rounded-2xl p-4"
    >
      <Text className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
        Next Workout
      </Text>
      <View className="flex-row items-center gap-3">
        <View
          className={`w-10 h-10 rounded-xl items-center justify-center ${
            isToday ? 'bg-orange-500/20' : 'bg-white/5'
          }`}
        >
          <Ionicons
            name={isToday ? 'flash' : 'calendar-outline'}
            size={20}
            color={isToday ? '#f97316' : 'rgba(255,255,255,0.5)'}
          />
        </View>
        <View className="flex-1">
          <Text className="text-white font-semibold text-base">{data.name}</Text>
          <View className="flex-row items-center gap-2 mt-0.5">
            <Text
              className={`text-xs font-semibold ${
                isToday ? 'text-orange-500' : 'text-white/50'
              }`}
            >
              {data.scheduledDay}
            </Text>
            <Text className="text-white/30 text-xs">·</Text>
            <Text className="text-white/40 text-xs">{data.totalExercises} exercises</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.2)" />
      </View>
      {data.exercises.length > 0 && (
        <View className="mt-3 flex-row flex-wrap gap-1.5">
          {data.exercises.map((name, i) => (
            <View
              key={i}
              className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1"
            >
              <Text className="text-white/50 text-[13px]">{name}</Text>
            </View>
          ))}
          {data.totalExercises > 3 && (
            <View className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1">
              <Text className="text-white/30 text-[13px]">
                +{data.totalExercises - 3} more
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
