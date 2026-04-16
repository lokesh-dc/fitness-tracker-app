import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import { apiFetch } from '@/lib/api'

export default function DashboardScreen() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleStartWorkout = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ hasPlan: boolean, planDay?: any }>('/api/mobile/workout/today', {
        token: token ?? undefined
      });

      if (data.hasPlan) {
        router.push({
          pathname: '/workout/today-preview',
          params: { planDay: JSON.stringify(data.planDay) }
        });
      } else {
        router.push('/workout/exercise-picker');
      }
    } catch {
      // Fallback: go to exercise picker so user is never blocked
      router.push('/workout/exercise-picker');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black px-6 pt-16">
      <Text className="text-white text-2xl font-medium mb-1">
        Hey, {user?.name?.split(' ')[0]} 👋
      </Text>
      <Text className="text-white/50 text-sm mb-8">Ready to train?</Text>

      <View className="gap-3">
        <TouchableOpacity
          onPress={handleStartWorkout}
          activeOpacity={0.8}
          className="bg-primary rounded-2xl p-5"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text className="text-white text-lg font-medium">Start workout</Text>
              <Text className="text-white/60 text-sm mt-1">Live session with rest timer</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/workout/log')}
          activeOpacity={0.7}
          className="bg-white/5 border border-white/10 rounded-2xl p-5"
        >
          <Text className="text-white text-base font-medium">Log past workout</Text>
          <Text className="text-white/40 text-sm mt-1">Manually enter a session</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
