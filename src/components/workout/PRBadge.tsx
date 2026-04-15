import { View, Text } from 'react-native'

export function PRBadge() {
  return (
    <View className="bg-primary/20 border border-primary/40 rounded-md px-2 py-0.5">
      <Text className="text-primary text-xs font-medium">PR</Text>
    </View>
  )
}
