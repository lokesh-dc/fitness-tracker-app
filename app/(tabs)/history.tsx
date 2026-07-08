import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity,
  ActivityIndicator, ScrollView, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useHistoryMonth } from '../../src/hooks/useHistoryMonth';
import { WorkoutLogEntry } from '../../src/types/workout';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return '—';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(dateStr?: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function calcVolume(exercises: WorkoutLogEntry['exercises']): number {
  let vol = 0;
  for (const ex of exercises) {
    for (const s of ex.sets) {
      vol += s.weight * s.reps;
    }
  }
  return vol;
}

function formatVolume(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}k`;
  return String(Math.round(kg));
}

export default function HistoryScreen() {
  const { token } = useAuth();
  const {
    currentMonth,
    monthData,
    loading,
    error,
    goToMonth,
    selectedDay,
    setSelectedDay,
    displayedLogs,
  } = useHistoryMonth();

  const [showMonthPicker, setShowMonthPicker] = useState(false);

  useEffect(() => {
    if (token) {
      goToMonth(currentMonth.year, currentMonth.month);
    }
  }, [token]);

  const today = new Date();
  const todayDate = today.getDate();

  const handleDayTap = (day: number) => {
    if (selectedDay === day) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
    }
  };

  const monthOptions: { label: string; year: number; month: number }[] = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthOptions.push({ label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`, year: d.getFullYear(), month: d.getMonth() });
  }

  const renderSets = (ex: WorkoutLogEntry['exercises'][0], hasPR: boolean, maxWeight: number) => (
    <View className="mt-1">
      {ex.sets.length > 0 && (
        <View className="flex-row items-center px-1 mb-1">
          <Text className="text-white/20 text-[11px] font-bold uppercase tracking-widest flex-1">Set</Text>
          <Text className="text-white/20 text-[11px] font-bold uppercase tracking-widest w-20 text-right">Weight</Text>
          <Text className="text-white/20 text-[11px] font-bold uppercase tracking-widest w-16 text-right">Reps</Text>
        </View>
      )}
      {ex.sets.map((set, setIdx) => {
        const isPRSet = hasPR && set.weight === maxWeight;
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
    </View>
  );

  const renderSession = (log: WorkoutLogEntry) => {
    const vol = calcVolume(log.exercises);
    return (
      <View key={log._id} className="mb-4">
        {/* Session header */}
        <View className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-3">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-white font-semibold text-base">{log.name || 'Workout'}</Text>
          </View>
          {log.splitName ? (
            <Text className="text-orange-500 text-sm font-medium mb-2">{log.splitName}</Text>
          ) : null}
          <View className="flex-row flex-wrap gap-y-1.5">
            <View className="w-1/2 flex-row items-center gap-1.5">
              <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.4)" />
              <Text className="text-white/50 text-xs">{formatDuration(log.durationSeconds)}</Text>
            </View>
            {log.bodyWeight ? (
              <View className="w-1/2 flex-row items-center gap-1.5">
                <Ionicons name="scale-outline" size={13} color="rgba(255,255,255,0.4)" />
                <Text className="text-white/50 text-xs">{log.bodyWeight} kg</Text>
              </View>
            ) : null}
            <View className="w-1/2 flex-row items-center gap-1.5">
              <Ionicons name="barbell-outline" size={13} color="rgba(255,255,255,0.4)" />
              <Text className="text-white/50 text-xs">{formatVolume(vol)} kg volume</Text>
            </View>
            {log.startedAt ? (
              <View className="w-1/2 flex-row items-center gap-1.5">
                <Ionicons name="play-outline" size={13} color="rgba(255,255,255,0.4)" />
                <Text className="text-white/50 text-xs">Started {formatTime(log.startedAt)}</Text>
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
            <View key={ex.exerciseId || exIdx} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-2">
              <View className="flex-row items-center justify-between">
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
              {ex.isSkipped ? (
                <Text className="text-white/30 text-sm italic mt-2">Skipped</Text>
              ) : ex.sets.length === 0 ? (
                <Text className="text-white/30 text-sm italic mt-2">No sets logged</Text>
              ) : (
                renderSets(ex, hadPR, maxWeight)
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-4 pb-3">
        <Text className="text-white text-xl font-bold">History</Text>
      </View>

      {/* Month dropdown + horizontal day row */}
      <View className="mx-4 mb-2 bg-white/5 border border-white/10 rounded-xl">
        <View className="flex-row items-stretch">
          <TouchableOpacity
            onPress={() => setShowMonthPicker(true)}
            className="flex-row items-center gap-1 px-3 py-3 border-r border-white/10 min-w-[100px]"
            activeOpacity={0.7}
          >
            <Text className="text-orange-500 text-sm font-semibold">
              {MONTH_NAMES[currentMonth.month].slice(0, 3)} {currentMonth.year}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#f97316" />
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 8, alignItems: 'stretch' }}
          >
            {monthData?.days
              .filter(d => d.date > 0)
              .map((day) => {
                const isSelected = selectedDay === day.date;
                const isToday = day.date === todayDate &&
                  currentMonth.month === today.getMonth() &&
                  currentMonth.year === today.getFullYear();
                return (
                  <TouchableOpacity
                    key={day.date}
                    onPress={() => handleDayTap(day.date)}
                    className="items-center justify-center px-[5px] py-2"
                    activeOpacity={0.6}
                  >
                    <Text className="text-white/30 text-[11px] font-bold uppercase tracking-widest mb-1">
                      {new Date(currentMonth.year, currentMonth.month, day.date)
                        .toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)}
                    </Text>
                    <View
                      className="items-center justify-center w-9 h-9 rounded-full"
                      style={{
                        backgroundColor: isSelected
                          ? 'rgba(249,115,22,0.2)'
                          : isToday
                            ? 'rgba(255,255,255,0.08)'
                            : 'transparent',
                        borderWidth: isSelected ? 1 : isToday ? 1 : 0,
                        borderColor: isSelected ? '#f97316' : isToday ? 'rgba(255,255,255,0.2)' : 'transparent',
                      }}
                    >
                      <Text className={`text-sm font-medium ${
                        isSelected ? 'text-orange-500' : isToday ? 'text-white' : 'text-white/70'
                      }`}>
                        {day.date}
                      </Text>
                      {day.hasSession && (
                        <View className="absolute -bottom-[2px]">
                          {day.hasPR ? (
                            <Ionicons name="trophy" size={9} color="#f97316" />
                          ) : (
                            <View className="w-[4px] h-[4px] rounded-full bg-white/30" />
                          )}
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>
      </View>

      {/* Content area */}
      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="text-white/40 mt-4 font-medium tracking-widest uppercase text-[12px]">
            Loading sessions
          </Text>
        </View>
      )}

      {error && (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-500 text-center mb-4 font-medium">{error}</Text>
          <TouchableOpacity
            onPress={() => goToMonth(currentMonth.year, currentMonth.month)}
            className="bg-orange-500 px-8 py-3 rounded-2xl"
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && selectedDay != null && displayedLogs.length === 0 && (
        <View className="flex-1 items-center justify-center px-6 pb-16">
          <Ionicons name="fitness-outline" size={48} color="rgba(255,255,255,0.15)" />
          <Text className="text-white/30 text-base mt-4 text-center">No session on this day</Text>
          <Text className="text-white/20 text-sm mt-2 text-center">Try selecting a different day</Text>
        </View>
      )}

      {!loading && !error && selectedDay == null && (
        <View className="flex-1 items-center justify-center px-6 pb-16">
          <Ionicons name="calendar-outline" size={48} color="rgba(255,255,255,0.15)" />
          <Text className="text-white/30 text-base mt-4 text-center">Select a day to view sessions</Text>
        </View>
      )}

      {!loading && !error && displayedLogs.length > 0 && (
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* Selected day label */}
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.4)" />
            <Text className="text-white/60 text-sm font-medium">
              {new Date(currentMonth.year, currentMonth.month, selectedDay!)
                .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>

          {displayedLogs.map(renderSession)}

          {/* v2 placeholder note */}
          <View className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <Text className="text-white/20 text-xs text-center">
              Editing sessions coming in a future update
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
