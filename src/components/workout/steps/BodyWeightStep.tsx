import React from 'react';
import { Feather } from '@expo/vector-icons';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { StickyBottomBar } from '../shared/StickyBottomBar';
import { StepIndicator } from '../shared/StepIndicator';

interface BodyWeightStepProps {
  bodyWeight: string;
  setBodyWeight: (val: string) => void;
  lastBodyWeight: number | null;
  unit: 'kg' | 'lb';
  goNext: () => void;
  handleBack: () => void;
}

export const BodyWeightStep: React.FC<BodyWeightStepProps> = ({
  bodyWeight,
  setBodyWeight,
  lastBodyWeight,
  unit,
  goNext,
  handleBack,
}) => {
  const isValid = bodyWeight !== '' && !isNaN(parseFloat(bodyWeight)) && parseFloat(bodyWeight) > 0;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#0a0a0a]"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 px-6">
          <View className="flex-row items-center justify-between mb-2 mt-4">
            <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
              <Feather name="chevron-left" color="white" size={24} />
            </TouchableOpacity>
            <StepIndicator currentStep={2} />
            <View className="w-10" />
          </View>
          
          <View className="flex-1 justify-center items-center pb-20">
            <Text className="text-white text-3xl font-bold mb-2">
              Current Weight
            </Text>
            <Text className="text-white/40 text-center mb-12">
              Log your body weight to track relative strength.
            </Text>

            <View className="flex-row items-baseline">
              <TextInput
                value={bodyWeight}
                onChangeText={setBodyWeight}
                keyboardType="numeric"
                placeholder="00.0"
                placeholderTextColor="rgba(255,255,255,0.1)"
                autoFocus
                className="text-white text-6xl font-bold border-b-2 border-orange-500 min-w-[120px] text-center"
              />
              <Text className="text-white/40 text-2xl font-bold ml-2">
                {unit}
              </Text>
            </View>

            <Text className="text-white/40 text-sm mt-8">
              Last logged: {lastBodyWeight ? `${lastBodyWeight} ${unit}` : 'No previous entry'}
            </Text>

            <TouchableOpacity 
              onPress={goNext}
              className="mt-8"
            >
              <Text className="text-white/20 text-sm font-semibold">Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <StickyBottomBar
        primaryLabel="Continue →"
        onPrimary={goNext}
        primaryDisabled={!isValid}
        secondaryLabel="Skip"
        onSecondary={goNext}
      />
    </KeyboardAvoidingView>
  );
};
