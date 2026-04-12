import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { generateWarmupSets } from '@/lib/warmup-calculator'
import { WorkingSet } from '@/types/workout'

interface Props {
  workingWeight: number
  targetReps: number
  unit: 'kg' | 'lbs'
}

export function WarmupSetsPanel({ workingWeight, targetReps, unit }: Props) {
  const [expanded, setExpanded] = useState(false)
  const warmupSets = generateWarmupSets(workingWeight, targetReps, unit)

  if (warmupSets.length === 0) return null

  return (
    <View className="mt-2 mb-1">
      <TouchableOpacity
        onPress={() => setExpanded(v => !v)}
        activeOpacity={0.7}
        className="flex-row items-center gap-2 py-1"
      >
        <Text className="text-white/40 text-xs">
          {expanded ? '▾' : '▸'} Warm-up sets ({warmupSets.length})
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View className="mt-1 gap-1">
          {warmupSets.map((s, i) => (
            <View
              key={i}
              className="flex-row items-center justify-between bg-white/3 rounded-lg px-3 py-2"
            >
              <Text className="text-white/40 text-xs">{s.percentage}%</Text>
              <Text className="text-white/60 text-sm">
                {s.weight} {unit} × {s.reps}
              </Text>
              <Text className="text-white/30 text-xs">warm-up</Text>
            </View>
          ))}
          <Text className="text-white/25 text-xs mt-1 ml-1">
            Warm-up sets are never saved
          </Text>
        </View>
      )}
    </View>
  )
}
