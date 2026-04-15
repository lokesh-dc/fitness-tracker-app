import { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'
import { useRestTimer } from '@/hooks/useRestTimer'

interface Props {
  restTimer: ReturnType<typeof useRestTimer>
}

export function RestTimerBar({ restTimer }: Props) {
  const { secondsLeft, isRunning, progress, skip } = restTimer
  const [widthAnim] = useState(() => new Animated.Value(1))

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 400,
      useNativeDriver: false,
    }).start()
  }, [progress])

  if (!isRunning) return null

  return (
    <View className="mx-4 mb-3 bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      {/* Progress bar */}
      <Animated.View
        className="absolute left-0 top-0 bottom-0 bg-primary/30"
        style={{ width: widthAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }}
      />
      <View className="flex-row items-center justify-between px-4 py-3">
        <View>
          <Text className="text-white/50 text-xs mb-0.5">Rest timer</Text>
          <Text className="text-white text-lg font-medium">{secondsLeft}s</Text>
        </View>
        <TouchableOpacity
          onPress={skip}
          activeOpacity={0.7}
          className="bg-white/10 rounded-lg px-3 py-2"
        >
          <Text className="text-white/70 text-sm">Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
