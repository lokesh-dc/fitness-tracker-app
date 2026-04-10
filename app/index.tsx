import { Redirect } from 'expo-router'
import { useAuth } from '@/context/AuthContext'
import { View, ActivityIndicator } from 'react-native'

export default function Index() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator color="#f97316" />
      </View>
    )
  }

  return <Redirect href={user ? '/(tabs)/' : '/(auth)/login'} />
}
