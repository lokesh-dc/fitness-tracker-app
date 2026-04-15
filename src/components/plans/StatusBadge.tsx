import { View, Text } from 'react-native'
import { PlanStatus } from '@/types/plan'

const CONFIG: Record<PlanStatus, { label: string; bg: string; text: string }> = {
  active:    { label: 'Active',    bg: 'bg-primary/15',    text: 'text-primary' },
  draft:     { label: 'Draft',     bg: 'bg-white/8',       text: 'text-white/40' },
  completed: { label: 'Completed', bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
}

export function StatusBadge({ status }: { status: PlanStatus }) {
  const { label, bg, text } = CONFIG[status]
  return (
    <View className={`${bg} rounded-md px-2 py-0.5`}>
      <Text className={`${text} text-xs font-medium`}>{label}</Text>
    </View>
  )
}
