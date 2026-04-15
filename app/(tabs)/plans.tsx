import { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, ActivityIndicator,
  TouchableOpacity, RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Plan, PlanStatus } from '@/types/plan'
import { PlanCard } from '@/components/plans/PlanCard'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/lib/api'

const STATUS_ORDER: PlanStatus[] = ['active', 'draft', 'completed']
const STATUS_LABELS: Record<PlanStatus, string> = {
  active: 'Active',
  draft: 'Drafts',
  completed: 'Completed',
}

export default function PlansScreen() {
  const { token } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadPlans(isRefresh = false) {
    if (isRefresh) setIsRefreshing(true)
    else setIsLoading(true)
    setError(null)

    try {
      const data = await apiFetch<{ plans: Plan[] }>('/api/plans', { token: token! })
      setPlans(data.plans)
    } catch (e: any) {
      setError(e.message ?? 'Failed to load plans')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => { loadPlans() }, [])

  // Group plans by status
  const grouped = STATUS_ORDER.reduce<Record<PlanStatus, Plan[]>>(
    (acc, status) => {
      acc[status] = plans.filter(p => p.status === status)
      return acc
    },
    { active: [], draft: [], completed: [] }
  )

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-4 pt-2 pb-4">
        <Text className="text-white text-2xl font-medium">Plans</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#f97316" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-white/40 text-base text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={() => loadPlans()}
            activeOpacity={0.7}
            className="bg-white/5 border border-white/10 rounded-xl px-5 py-3"
          >
            <Text className="text-white/60 text-sm">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : plans.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-white/30 text-base">No plans yet</Text>
          <Text className="text-white/20 text-sm mt-1 text-center">
            Create a plan on the web app to get started
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadPlans(true)}
              tintColor="#f97316"
            />
          }
        >
          {STATUS_ORDER.map(status => {
            const group = grouped[status]
            if (group.length === 0) return null
            return (
              <View key={status} className="mb-6">
                <Text className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">
                  {STATUS_LABELS[status]}
                </Text>
                {group.map(plan => (
                  <PlanCard key={plan._id} plan={plan} />
                ))}
              </View>
            )
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
