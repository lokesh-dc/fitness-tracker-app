import { useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  ScrollView, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useHomeData } from '@/hooks/useHomeData';
import StreakWidget from '@/components/home/StreakWidget';
import NextWorkoutWidget from '@/components/home/NextWorkoutWidget';
import WeekSnapshotWidget from '@/components/home/WeekSnapshotWidget';
import CalendarHeatmapWidget from '@/components/home/CalendarHeatmapWidget';

export default function DashboardScreen() {
  const { user, token } = useAuth();
  const { data, loading, error, refetch } = useHomeData();

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token]);

  const greeting = user?.name?.split(' ')[0] || 'there';

  if (loading && !data) {
    return (
      <SafeAreaView className="flex-1 bg-[#0a0a0a]" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="text-white/40 mt-4 font-medium tracking-widest uppercase text-[10px]">
            Loading
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !data) {
    return (
      <SafeAreaView className="flex-1 bg-[#0a0a0a]" edges={['top']}>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={48} color="rgba(255,255,255,0.2)" />
          <Text className="text-red-500 text-center mt-4 mb-4 font-medium">
            {error}
          </Text>
          <TouchableOpacity
            onPress={refetch}
            className="bg-orange-500 px-8 py-3 rounded-2xl"
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]" edges={['top']}>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor="#f97316"
            colors={['#f97316']}
          />
        }
      >
        {/* Header */}
        <View className="pt-4 pb-2">
          <Text className="text-white text-2xl font-bold">
            Hey, {greeting}
          </Text>
          <Text className="text-white/40 text-sm mt-0.5">Ready to train?</Text>
        </View>

        {/* Action buttons */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            onPress={() => router.push('/workout')}
            activeOpacity={0.8}
            className="flex-1 bg-primary rounded-2xl p-4"
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text className="text-white text-base font-semibold mt-2">
              Start
            </Text>
            <Text className="text-white/60 text-[11px] mt-0.5">
              Live session
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/workout/log')}
            activeOpacity={0.7}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4"
          >
            <Ionicons name="create-outline" size={20} color="rgba(255,255,255,0.5)" />
            <Text className="text-white text-base font-semibold mt-2">
              Log
            </Text>
            <Text className="text-white/40 text-[11px] mt-0.5">
              Past workout
            </Text>
          </TouchableOpacity>
        </View>

        {/* Widgets */}
        <View className="gap-4">
          {data?.streak && (
            <StreakWidget data={data.streak} />
          )}

          <NextWorkoutWidget data={data?.nextWorkout ?? null} />

          {data?.weekSnapshot && (
            <WeekSnapshotWidget data={data.weekSnapshot} />
          )}

          {data?.monthDates && (
            <CalendarHeatmapWidget monthDates={data.monthDates} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
