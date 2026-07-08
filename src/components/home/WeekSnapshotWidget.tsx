import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeekSnapshotData } from '@/hooks/useHomeData';

interface Props {
  data: WeekSnapshotData;
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function WeekSnapshotWidget({ data }: Props) {
  const percentage = data.sessionsPlanned > 0
    ? Math.round((data.sessionsCompleted / data.sessionsPlanned) * 100)
    : 0;

  return (
    <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <Text className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
        This Week
      </Text>

      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-white text-lg font-bold">
          {data.sessionsCompleted}
          <Text className="text-white/30 font-normal"> / {data.sessionsPlanned}</Text>
        </Text>
        <Text className="text-white/40 text-sm font-medium">
          {percentage}%
        </Text>
      </View>

      <View className="flex-row gap-1.5">
        {DAY_LABELS.map((label, i) => {
          const isCompleted = data.completedDays.includes(i);
          const isPlanned = data.plannedDays.includes(i);
          return (
            <View key={i} className="flex-1 items-center">
              <Text className="text-white/30 text-[11px] font-bold uppercase tracking-wider mb-1">
                {label}
              </Text>
              <View
                className={`w-full h-8 rounded-lg items-center justify-center ${
                  isCompleted
                    ? 'bg-orange-500/30 border border-orange-500/40'
                    : isPlanned
                      ? 'bg-white/5 border border-white/10'
                      : 'bg-white/[0.02] border border-white/5'
                }`}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color="#f97316" />
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
