import React from 'react';
import { View } from 'react-native';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <View className="flex-row items-center justify-center gap-x-3 py-4">
      {[1, 2, 3, 4].map((step) => {
        const isActive = step === currentStep;
        return (
          <View
            key={step}
            className={`rounded-full h-1.5 ${
              isActive ? 'bg-orange-500 w-6' : 'bg-white/20 w-1.5'
            }`}
          />
        );
      })}
    </View>
  );
};
