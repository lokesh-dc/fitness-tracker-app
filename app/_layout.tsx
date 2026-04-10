import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { AuthProvider } from '@/context/AuthContext'
import * as SplashScreen from 'expo-splash-screen'
import '../global.css'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  )
}
