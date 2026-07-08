import { View, Text, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import Svg, { Path } from 'react-native-svg'

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <View className="flex-1 bg-black">
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="flex-row items-center px-4 pb-4"
      >
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 12H5M12 19L5 12L12 5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold ml-4">Profile</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-white/50 text-base">Profile — coming soon</Text>
      </View>
    </View>
  )
}
