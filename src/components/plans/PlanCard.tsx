import { View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Plan } from '@/types/plan'
import { StatusBadge } from './StatusBadge'

interface Props {
  plan: Plan
}

export function PlanCard({ plan }: Props) {
  const dayCount = plan.days.length
  const exerciseCount = plan.days.reduce((n, d) => n + d.exercises.length, 0)

  return (
    <TouchableOpacity
      onPress={() => router.push(`/plans/${plan._id}`)}
      activeOpacity={0.7}
      className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-3"
    >
      <View className="flex-row items-start justify-between mb-2">
        <Text className="text-white text-base font-medium flex-1 mr-3">{plan.name}</Text>
        <StatusBadge status={plan.status} />
      </View>

      <View className="flex-row gap-4">
        <Text className="text-white/40 text-sm">{dayCount} day{dayCount !== 1 ? 's' : ''}/week</Text>
        <Text className="text-white/40 text-sm">{exerciseCount} exercises</Text>
        {plan.weeksCount > 0 && (
          <Text className="text-white/40 text-sm">{plan.weeksCount} weeks</Text>
        )}
      </View>

      {plan.startDate && (
        <Text className="text-white/25 text-xs mt-2">
          Started {new Date(plan.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
      )}
    </TouchableOpacity>
  )
}
