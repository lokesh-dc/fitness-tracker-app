import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StickyBottomBar } from '../shared/StickyBottomBar';
import { StepIndicator } from '../shared/StepIndicator';
import { ExerciseRowCard } from '../shared/ExerciseRowCard';
import { SessionExercise } from '../../../types/workout';
import { format } from 'date-fns';

interface ExerciseOverviewStepProps {
  workoutName: string;
  exercises: SessionExercise[];
  isLive: boolean;
  setIsLive: (val: boolean) => void;
  goNext: () => void;
  handleBack: () => void;
  setStartedAt: (date: Date) => void;
}

export const ExerciseOverviewStep: React.FC<ExerciseOverviewStepProps> = ({
  workoutName,
  exercises,
  isLive,
  setIsLive,
  goNext,
  handleBack,
  setStartedAt,
}) => {
  const onStart = () => {
    setStartedAt(new Date());
    goNext();
  };

  const today = format(new Date(), 'EEEE, d MMM');

  return (
    <View className="flex-1 bg-[#0a0a0a]">
      <View className="px-6 pt-4">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
            <Ionicons name="chevron-back" color="white" size={28} />
          </TouchableOpacity>
          <StepIndicator currentStep={1} />
          <View className="w-10" />
        </View>
        
        <View className="mb-6">
          <Text className="text-white text-3xl font-bold mb-1">
            Ready for your workout?
          </Text>
          <Text className="text-white/40 font-medium mb-4 uppercase tracking-widest text-[10px]">
            {workoutName} • {today}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
              <Text className="text-white/80 text-xs font-bold">
                {exercises.length} exercises
              </Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item, index) => `${item.exerciseId}-${index}`}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 150 }}
        renderItem={({ item }) => (
          <ExerciseRowCard exercise={item} variant="preview" />
        )}
      />

      <StickyBottomBar
        primaryLabel="Start Now →"
        onPrimary={onStart}
        hint={isLive ? "Live session with auto rest timer" : "Manual log entry mode"}
      >
        <TouchableOpacity 
          onPress={() => setIsLive(!isLive)}
          activeOpacity={0.8}
          className="flex-row items-center justify-between bg-white/5 border border-white/10 px-4 py-3 rounded-2xl mb-4"
        >
          <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest">
            Currently working out?
          </Text>
          <View className="flex-row items-center gap-x-2">
            <Text className={`text-[10px] font-bold uppercase ${isLive ? 'text-orange-500' : 'text-white/20'}`}>
              {isLive ? 'Live Session' : 'Manual Log'}
            </Text>
            <View className={`w-10 h-5 rounded-full px-1 justify-center ${isLive ? 'bg-orange-500' : 'bg-white/10'}`}>
              <View className={`w-3 h-3 rounded-full bg-white ${isLive ? 'self-end' : 'self-start'}`} />
            </View>
          </View>
        </TouchableOpacity>
      </StickyBottomBar>
    </View>
  );
};
