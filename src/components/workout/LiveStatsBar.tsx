import { View, Text } from 'react-native'
import { formatElapsed } from '@/hooks/useSessionStats'

interface Props {
  elapsedSeconds: number
  totalVolume: number
  setsCompleted: number
  unit: 'kg' | 'lbs'
}

export function LiveStatsBar({ elapsedSeconds, totalVolume, setsCompleted, unit }: Props) {
  return (
    <View className="flex-row mx-4 mb-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 gap-6">
      <View>
        <Text className="text-white/40 text-xs mb-0.5">Duration</Text>
        <Text className="text-white text-sm font-medium">{formatElapsed(elapsedSeconds)}</Text>
      </View>
      <View>
        <Text className="text-white/40 text-xs mb-0.5">Volume</Text>
        <Text className="text-white text-sm font-medium">
          {totalVolume > 0 ? `${totalVolume.toLocaleString()} ${unit}` : '—'}
        </Text>
      </View>
      <View>
        <Text className="text-white/40 text-xs mb-0.5">Sets done</Text>
        <Text className="text-white text-sm font-medium">{setsCompleted}</Text>
      </View>
    </View>
  )
}
