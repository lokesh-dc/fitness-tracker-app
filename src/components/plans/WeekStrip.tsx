import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { PlanDay } from '@/types/plan'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// dayOfWeek: 0 = Sunday … 6 = Saturday
function getTodayIndex(): number {
  return new Date().getDay()   // 0 = Sunday in JS
}

interface Props {
  days: PlanDay[]
  selectedDayIndex: number | null    // dayOfWeek value of selected day
  loggedDayIndexes: number[]         // dayOfWeek values that have a session logged this week
  onSelectDay: (dayOfWeek: number) => void
}

export function WeekStrip({ days, selectedDayIndex, loggedDayIndexes, onSelectDay }: Props) {
  const todayIndex = getTodayIndex()
  const plannedIndexes = new Set(days.map(d => d.dayOfWeek))

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 4 }}
    >
      {DAY_LABELS.map((label, i) => {
        const isPlanned = plannedIndexes.has(i)
        const isSelected = selectedDayIndex === i
        const isToday = i === todayIndex
        const isLogged = loggedDayIndexes.includes(i)

        return (
          <TouchableOpacity
            key={i}
            onPress={() => isPlanned && onSelectDay(i)}
            activeOpacity={isPlanned ? 0.7 : 1}
            className={`w-14 items-center py-3 rounded-xl border ${
              isSelected
                ? 'bg-primary border-primary'
                : isPlanned
                ? 'bg-white/5 border-white/15'
                : 'bg-transparent border-transparent'
            }`}
          >
            <Text className={`text-xs mb-1 ${
              isSelected ? 'text-white' : isToday ? 'text-primary' : 'text-white/40'
            }`}>
              {label}
            </Text>

            {/* Dot indicators */}
            <View className="flex-row gap-1 mt-0.5">
              {isPlanned && (
                <View className={`w-1.5 h-1.5 rounded-full ${
                  isSelected ? 'bg-white' : 'bg-white/30'
                }`} />
              )}
              {isLogged && (
                <View className={`w-1.5 h-1.5 rounded-full ${
                  isSelected ? 'bg-white/70' : 'bg-emerald-400'
                }`} />
              )}
            </View>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}
