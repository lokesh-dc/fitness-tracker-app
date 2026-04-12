import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { WorkingSet } from '@/types/workout'

interface Props {
  set: WorkingSet
  index: number
  unit: 'kg' | 'lbs'
  onUpdate: (updates: Partial<WorkingSet>) => void
  onDone: () => void    // marks set complete and triggers rest timer
}

export function SetRow({ set, index, unit, onUpdate, onDone }: Props) {
  return (
    <View
      className={`flex-row items-center gap-3 py-2 px-1 rounded-xl mb-1 ${
        set.isDone ? 'bg-primary/8' : 'bg-transparent'
      }`}
    >
      {/* Set number */}
      <Text className="text-white/30 text-sm w-5 text-center">{index + 1}</Text>

      {/* Weight input */}
      <View className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
        <Text className="text-white/30 text-xs mb-0.5">{unit}</Text>
        <TextInput
          value={set.weight > 0 ? String(set.weight) : ''}
          onChangeText={(v) => onUpdate({ weight: parseFloat(v) || 0 })}
          placeholder="0"
          placeholderTextColor="rgba(255,255,255,0.15)"
          keyboardType="decimal-pad"
          className="text-white text-base p-0"
          editable={!set.isDone}
          selectTextOnFocus
        />
      </View>

      {/* Reps input */}
      <View className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
        <Text className="text-white/30 text-xs mb-0.5">reps</Text>
        <TextInput
          value={set.reps > 0 ? String(set.reps) : ''}
          onChangeText={(v) => onUpdate({ reps: parseInt(v) || 0 })}
          placeholder="0"
          placeholderTextColor="rgba(255,255,255,0.15)"
          keyboardType="number-pad"
          className="text-white text-base p-0"
          editable={!set.isDone}
          selectTextOnFocus
        />
      </View>

      {/* Done toggle */}
      <TouchableOpacity
        onPress={onDone}
        activeOpacity={0.7}
        className={`w-10 h-10 rounded-xl items-center justify-center border ${
          set.isDone
            ? 'bg-primary border-primary'
            : 'bg-white/5 border-white/15'
        }`}
      >
        <Text className={set.isDone ? 'text-white text-base' : 'text-white/30 text-base'}>
          ✓
        </Text>
      </TouchableOpacity>
    </View>
  )
}
