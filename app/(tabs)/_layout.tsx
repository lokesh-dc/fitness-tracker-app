import { Tabs } from 'expo-router'
import { useAuth } from '@/context/AuthContext'
import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

export default function TabsLayout() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator color="#f97316" />
      </View>
    )
  }

  if (!user) return <Redirect href="/(auth)/login" />

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderTopColor: 'rgba(255,255,255,0.08)',
        },
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="plans" options={{ title: 'Plans' }} />
      <Tabs.Screen name="analytics" options={{ title: 'Analytics' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  )
}
