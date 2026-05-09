import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { PRHit } from '../../types/workout';

interface PRCelebrationOverlayProps {
  pr: PRHit;
}

export const PRCelebrationOverlay: React.FC<PRCelebrationOverlayProps> = ({ pr }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isWeightPR = pr.type === 'WEIGHT';
  const prValueText = isWeightPR 
    ? `${pr.setWeight} kg × ${pr.setReps}` 
    : `${pr.setWeight} kg × ${pr.setReps} reps`;
    
  const previousBestText = isWeightPR
    ? `↑ Previous best: ${pr.previousValue} kg`
    : `↑ Previous best: ${pr.previousValue} reps`;

  return (
    <Animated.View 
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor: 'rgba(0,0,0,0.92)',
          zIndex: 999,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeAnim,
        }
      ]}
    >
      <Animated.View 
        style={{
          alignItems: 'center',
          transform: [{ scale: scaleAnim }]
        }}
      >
        <Text style={{ fontSize: 72, marginBottom: 24 }}>🏆</Text>
        
        <Text className="text-orange-500 font-bold mb-4 text-center tracking-[4px]" style={{ fontSize: 36 }}>
          NEW PR!
        </Text>
        
        <Text className="text-white/80 mb-8 text-center" style={{ fontSize: 20 }}>
          {pr.exerciseName}
        </Text>
        
        <Text className="text-white font-bold mb-4 text-center" style={{ fontSize: 32 }}>
          {prValueText}
        </Text>
        
        <Text className="text-white/40 text-center" style={{ fontSize: 14 }}>
          {previousBestText}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};
