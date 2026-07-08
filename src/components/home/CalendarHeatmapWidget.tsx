import { useMemo } from 'react';
import { View, Text } from 'react-native';

interface Props {
  monthDates: string[];
}

const DAY_HEADERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarHeatmapWidget({ monthDates }: Props) {
  const { year, month, days } = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const startDay = new Date(y, m, 1).getDay();

    const dateSet = new Set(monthDates);

    const cells: Array<{ day: number; hasSession: boolean }> = [];
    for (let i = 0; i < startDay; i++) {
      cells.push({ day: 0, hasSession: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, hasSession: dateSet.has(dateStr) });
    }

    return { year: y, month: m, days: cells };
  }, [monthDates]);

  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <View className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <Text className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
        This Month
      </Text>

      <View className="flex-row mb-2">
        {DAY_HEADERS.map((label, i) => (
          <View key={i} className="flex-1 items-center">
            <Text className="text-white/20 text-[9px] font-bold uppercase tracking-wider">
              {label}
            </Text>
          </View>
        ))}
      </View>

      {weeks.map((week, wi) => (
        <View key={wi} className="flex-row mb-1">
          {week.map((cell, ci) => (
            <View key={ci} className="flex-1 items-center py-1">
              {cell.day > 0 ? (
                <View className="items-center justify-center">
                  <Text
                    className={`text-xs ${
                      cell.hasSession ? 'text-orange-500 font-semibold' : 'text-white/40'
                    }`}
                  >
                    {cell.day}
                  </Text>
                  {cell.hasSession && (
                    <View className="w-[3px] h-[3px] rounded-full bg-orange-500 mt-[1px]" />
                  )}
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
