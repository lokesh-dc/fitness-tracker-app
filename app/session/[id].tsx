import { useLocalSearchParams, router } from 'expo-router';
import {
  View, Text, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutLogEntry } from '../../src/types/workout';

function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return '—';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

function formatDate(dateStr: string): string {
  // Parse YYYY-MM-DD as local date to avoid timezone shifts
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(dateStr?: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SessionDetailScreen() {
  const { logData } = useLocalSearchParams<{ logData?: string }>();

  let log: WorkoutLogEntry | null = null;
  if (logData) {
    try {
      log = JSON.parse(logData);
    } catch {}
  }

  if (!log) {
    return (
      <SafeAreaView className="flex-1 bg-[#0a0a0a] items-center justify-center">
        <Text className="text-white/50 text-base">Session not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-orange-500 px-6 py-2 rounded-2xl">
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="chevron-back" size={24} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
        <Text className="text-white text-base font-semibold">Session Detail</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Session header card */}
        <View className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 mb-4">
          <Text className="text-white text-lg font-bold mb-1">{log.name || 'Workout'}</Text>
          {log.splitName ? (
            <Text className="text-orange-500 text-sm font-medium mb-3">{log.splitName}</Text>
          ) : null}

          <View className="flex-row flex-wrap gap-y-2">
            <View className="w-1/2 flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.4)" />
              <Text className="text-white/60 text-sm">{formatDate(log.date)}</Text>
            </View>
            <View className="w-1/2 flex-row items-center gap-2">
              <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.4)" />
              <Text className="text-white/60 text-sm">{formatDuration(log.durationSeconds)}</Text>
            </View>
            {log.bodyWeight ? (
              <View className="w-1/2 flex-row items-center gap-2">
                <Ionicons name="scale-outline" size={14} color="rgba(255,255,255,0.4)" />
                <Text className="text-white/60 text-sm">{log.bodyWeight} kg</Text>
              </View>
            ) : null}
            {log.startedAt ? (
              <View className="w-1/2 flex-row items-center gap-2">
                <Ionicons name="play-outline" size={14} color="rgba(255,255,255,0.4)" />
                <Text className="text-white/60 text-sm">{formatTime(log.startedAt)}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Exercises */}
        {log.exercises.map((ex, exIdx) => {
          const maxWeight = ex.sets.length > 0
            ? Math.max(...ex.sets.map(s => s.weight))
            : 0;
          const hadPR = ex.pr != null && maxWeight > ex.pr;

          return (
            <View key={ex.exerciseId || exIdx} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white font-semibold text-base flex-1" numberOfLines={1}>
                  {ex.name}
                </Text>
                {hadPR && (
                  <View className="flex-row items-center bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5 ml-2">
                    <Ionicons name="trophy" size={12} color="#f97316" />
                    <Text className="text-orange-500 text-[12px] font-bold ml-1">PR</Text>
                  </View>
                )}
              </View>

              {/* Sets header */}
              {ex.sets.length > 0 && (
                <View className="flex-row items-center px-1 mb-1">
                  <Text className="text-white/30 text-[12px] font-bold uppercase tracking-widest flex-1">Set</Text>
                  <Text className="text-white/30 text-[12px] font-bold uppercase tracking-widest w-20 text-right">Weight</Text>
                  <Text className="text-white/30 text-[12px] font-bold uppercase tracking-widest w-16 text-right">Reps</Text>
                </View>
              )}

              {/* Sets */}
              {ex.sets.map((set, setIdx) => {
                const isPRSet = hadPR && set.weight === maxWeight;
                return (
                  <View
                    key={setIdx}
                    className={`flex-row items-center px-2 py-1.5 rounded-lg mb-0.5 ${
                      isPRSet ? 'bg-amber-500/10 border border-amber-500/20' : ''
                    }`}
                  >
                    <Text className="text-white/40 text-sm flex-1">{setIdx + 1}</Text>
                    <Text className={`text-sm w-20 text-right font-medium ${
                      isPRSet ? 'text-orange-500' : 'text-white/80'
                    }`}>
                      {set.weight}
                    </Text>
                    <Text className={`text-sm w-16 text-right font-medium ${
                      isPRSet ? 'text-orange-500' : 'text-white/80'
                    }`}>
                      {set.reps}
                    </Text>
                    {isPRSet && (
                      <View className="ml-2">
                        <Ionicons name="trophy" size={12} color="#f97316" />
                      </View>
                    )}
                  </View>
                );
              })}

              {ex.isSkipped && (
                <Text className="text-white/30 text-sm italic mt-1">Skipped</Text>
              )}

              {ex.sets.length === 0 && !ex.isSkipped && (
                <Text className="text-white/30 text-sm italic">No sets logged</Text>
              )}
            </View>
          );
        })}

        {/* v2 placeholder note — editing is future work */}
        <View className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4">
          <Text className="text-white/30 text-xs text-center">
            Editing sessions will be available in a future update
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
