import { View, Text, TouchableOpacity } from 'react-native'
import { useAuth } from '@/context/AuthContext'

export default function DashboardScreen() {
  const { user, logout } = useAuth()

  return (
    <View className="flex-1 bg-black px-6 pt-16">
      <Text className="text-white text-2xl font-medium mb-1">
        Hey, {user?.name?.split(' ')[0]} 👋
      </Text>
      <Text className="text-white/50 text-sm mb-8">Ready to train?</Text>

      <TouchableOpacity
        onPress={logout}
        className="mt-auto mb-12 py-3 items-center rounded-xl border border-white/10"
      >
        <Text className="text-white/40 text-sm">Sign out</Text>
      </TouchableOpacity>
    </View>
  )
}
