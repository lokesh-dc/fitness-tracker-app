import { useState, useEffect } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, Modal, ActivityIndicator,
} from 'react-native'
import { ExerciseMaster } from '@/types/workout'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

interface Props {
  visible: boolean
  onClose: () => void
  onSelect: (exercise: ExerciseMaster) => void
}

export function ExercisePickerModal({ visible, onClose, onSelect }: Props) {
  const { token } = useAuth()
  const [exercises, setExercises] = useState<ExerciseMaster[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!visible) return
    setIsLoading(true)
    apiFetch<{ exercises: ExerciseMaster[] }>('/api/exercises', { token: token! })
      .then(data => setExercises(data.exercises))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [visible])

  const filtered = exercises.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-black pt-4">

        {/* Header */}
        <View className="flex-row items-center justify-between px-4 mb-4">
          <Text className="text-white text-lg font-medium">Add exercise</Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text className="text-white/50 text-base">Done</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="mx-4 mb-3">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search exercises..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            autoFocus
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
          />
        </View>

        {isLoading ? (
          <ActivityIndicator color="#f97316" className="mt-8" />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => item._id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => { onSelect(item); onClose() }}
                activeOpacity={0.7}
                className="flex-row items-center justify-between py-3.5 border-b border-white/5"
              >
                <View>
                  <Text className="text-white text-base">{item.name}</Text>
                  {item.muscleGroup && (
                    <Text className="text-white/40 text-xs mt-0.5">{item.muscleGroup}</Text>
                  )}
                </View>
                <Text className="text-primary text-lg">+</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </Modal>
  )
}
