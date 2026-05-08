import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { StickyBottomBar } from '../shared/StickyBottomBar';
import { StepIndicator } from '../shared/StepIndicator';
import { SessionExercise, SetEntry } from '../../../types/workout';
import { Feather } from '@expo/vector-icons';

interface ExerciseLogStepProps {
  exercise: SessionExercise;
  onSave: (updatedExercise: SessionExercise) => void;
  handleBack: () => void;
}

export const ExerciseLogStep: React.FC<ExerciseLogStepProps> = ({
  exercise,
  onSave,
  handleBack,
}) => {
  const [sets, setSets] = React.useState<SetEntry[]>(
    exercise.sets.length > 0 ? exercise.sets : [{ weight: '', reps: '', done: false }]
  );

  const handleUpdateSet = (index: number, field: keyof SetEntry, value: string | boolean) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    setSets([...sets, { weight: lastSet?.weight || '', reps: '', done: false }]);
  };

  const removeSet = () => {
    if (sets.length > 1) {
      setSets(sets.slice(0, -1));
    }
  };

  const handleSave = () => {
    // Filter out sets where both weight and reps are empty, or weight is 0
    const filteredSets = sets.filter(s => 
      (s.weight !== '' && parseFloat(s.weight) > 0) || (s.reps !== '' && parseInt(s.reps) > 0)
    ).filter(s => parseFloat(s.weight) !== 0);

    onSave({
      ...exercise,
      sets: filteredSets,
      isDone: true
    });
    handleBack();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#0a0a0a]"
    >
      <View className="px-6 pt-4">
        <StepIndicator currentStep={4} />
        
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
            <Feather name="chevron-left" color="white" size={24} />
          </TouchableOpacity>
          
          <View className="items-center flex-1 pr-8">
            <Text className="text-white font-bold text-xl text-center">
              {exercise.name}
            </Text>
            <View className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 mt-1">
              <Text className="text-orange-500 text-[10px] font-bold uppercase tracking-wider">
                {exercise.muscleGroup}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-x-3 mb-8 justify-center">
          <View className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl items-center">
            <Text className="text-orange-500 text-[10px] font-black uppercase mb-0.5 tracking-widest">Personal Record</Text>
            <Text className="text-white text-base font-bold">
              {exercise.currentPR > 0 ? `${exercise.currentPR} ${exercise.unit}` : 'None'}
            </Text>
          </View>
          <View className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl items-center">
            <Text className="text-white/40 text-[10px] font-bold uppercase mb-0.5 tracking-widest">Last Session</Text>
            <Text className="text-white text-base font-bold">
              {exercise.targetSets} × {exercise.targetReps}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ pb: 150 }}
      >
        <View className="flex-row mb-4 px-2">
          <Text className="w-10 text-white/40 text-[10px] font-black uppercase tracking-widest">#</Text>
          <Text className="flex-1 text-white/40 text-[10px] font-black uppercase tracking-widest text-center">Weight ({exercise.unit})</Text>
          <Text className="flex-1 text-white/40 text-[10px] font-black uppercase tracking-widest text-center">Reps</Text>
          <Text className="w-10 text-white/40 text-[10px] font-black uppercase tracking-widest text-right">✓</Text>
        </View>

        {sets.map((set, index) => (
          <View key={index} className="flex-row items-center mb-3 bg-white/5 p-2 rounded-xl border border-white/5">
            <View className="w-10">
              <Text className="text-white/40 font-bold">{index + 1}</Text>
            </View>
            
            <View className="flex-1 px-2">
              <TextInput
                value={set.weight}
                onChangeText={(val) => handleUpdateSet(index, 'weight', val)}
                keyboardType="numeric"
                placeholder={exercise.lastWeight > 0 ? exercise.lastWeight.toString() : '0'}
                placeholderTextColor="rgba(255,255,255,0.1)"
                className="text-white text-center font-bold text-lg border-b-2 border-transparent focus:border-orange-500 py-1"
              />
            </View>

            <View className="flex-1 px-2">
              <TextInput
                value={set.reps}
                onChangeText={(val) => handleUpdateSet(index, 'reps', val)}
                keyboardType="numeric"
                placeholder={exercise.targetReps.toString()}
                placeholderTextColor="rgba(255,255,255,0.1)"
                className="text-white text-center font-bold text-lg border-b-2 border-transparent focus:border-orange-500 py-1"
              />
            </View>

            <TouchableOpacity 
              onPress={() => handleUpdateSet(index, 'done', !set.done)}
              className={`w-10 h-10 rounded-full border items-center justify-center ${
                set.done ? 'bg-orange-500 border-orange-500' : 'border-white/20'
              }`}
            >
              {set.done && <Feather name="check" size={20} color="white" />}
            </TouchableOpacity>
          </View>
        ))}

        <View className="flex-row gap-x-4 mt-4">
          <TouchableOpacity 
            onPress={addSet}
            className="flex-1 py-3 rounded-xl border border-orange-500/30 bg-orange-500/5 items-center flex-row justify-center"
          >
            <Feather name="plus" size={16} color="#f97316" className="mr-2" />
            <Text className="text-orange-500 font-bold text-sm">Add Set</Text>
          </TouchableOpacity>

          {sets.length > 1 && (
            <TouchableOpacity 
              onPress={removeSet}
              className="flex-1 py-3 rounded-xl border border-red-500/30 bg-red-500/5 items-center flex-row justify-center"
            >
              <Feather name="minus" size={16} color="#ef4444" className="mr-2" />
              <Text className="text-red-500 font-bold text-sm">Remove Set</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <StickyBottomBar
        primaryLabel="Save Exercise ✓"
        onPrimary={handleSave}
      />
    </KeyboardAvoidingView>
  );
};
