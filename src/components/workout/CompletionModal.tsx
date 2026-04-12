import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native'

interface Props {
  visible: boolean
  totalVolume: number
  durationSeconds: number
  prsHit: string[]
  unit: 'kg' | 'lbs'
  onDone: () => void
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

export function CompletionModal({ visible, totalVolume, durationSeconds, prsHit, unit, onDone }: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/80 items-center justify-center px-6">
        <View className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full">

          {/* Trophy */}
          <Text className="text-5xl text-center mb-4">🏆</Text>

          <Text className="text-white text-2xl font-medium text-center mb-1">
            Session complete
          </Text>
          <Text className="text-white/40 text-sm text-center mb-6">
            Great work. Here's what you did.
          </Text>

          {/* Stats */}
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1 bg-white/5 rounded-xl p-3 items-center">
              <Text className="text-white/40 text-xs mb-1">Volume</Text>
              <Text className="text-white text-base font-medium">
                {totalVolume.toLocaleString()} {unit}
              </Text>
            </View>
            <View className="flex-1 bg-white/5 rounded-xl p-3 items-center">
              <Text className="text-white/40 text-xs mb-1">Duration</Text>
              <Text className="text-white text-base font-medium">
                {formatDuration(durationSeconds)}
              </Text>
            </View>
          </View>

          {/* PRs */}
          {prsHit.length > 0 && (
            <View className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4">
              <Text className="text-primary text-xs font-medium mb-2">
                🔥 New PRs this session
              </Text>
              {prsHit.map(name => (
                <Text key={name} className="text-white/80 text-sm">· {name}</Text>
              ))}
            </View>
          )}

          <TouchableOpacity
            onPress={onDone}
            activeOpacity={0.8}
            className="bg-primary rounded-xl py-4 items-center"
          >
            <Text className="text-white text-base font-medium">Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
