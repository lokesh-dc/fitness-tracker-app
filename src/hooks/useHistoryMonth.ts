import { useState, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { WorkoutLogEntry } from '../types/workout';

interface MonthKey {
  year: number;
  month: number; // 0-based
}

interface CalendarDay {
  date: number;
  hasSession: boolean;
  hasPR: boolean;
  logs: WorkoutLogEntry[];
}

interface MonthData {
  logs: WorkoutLogEntry[];
  days: CalendarDay[];
}

interface UseHistoryMonthReturn {
  currentMonth: MonthKey;
  monthData: MonthData | null;
  loading: boolean;
  error: string | null;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToMonth: (year: number, month: number) => void;
  selectedDay: number | null;
  setSelectedDay: (day: number | null) => void;
  displayedLogs: WorkoutLogEntry[];
}

function monthKey(y: number, m: number): string {
  return `${y}-${m}`;
}

function buildCalendar(year: number, month: number, logs: WorkoutLogEntry[]): CalendarDay[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfWeek = new Date(year, month, 1).getDay();

  const logByDate = new Map<string, WorkoutLogEntry[]>();
  for (const log of logs) {
    // date is YYYY-MM-DD string (server returns local date)
    const parts = log.date.split('-');
    if (parts.length < 3) continue;
    const d = parseInt(parts[2], 10);
    const existing = logByDate.get(String(d)) || [];
    existing.push(log);
    logByDate.set(String(d), existing);
  }

  const days: CalendarDay[] = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    days.push({ date: 0, hasSession: false, hasPR: false, logs: [] });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayLogs = logByDate.get(String(d)) || [];
    let hasPR = false;
    if (dayLogs.length > 0) {
      for (const log of dayLogs) {
        for (const ex of log.exercises) {
          if (ex.pr != null && ex.sets.length > 0) {
            const maxWeight = Math.max(...ex.sets.map(s => s.weight));
            if (maxWeight > ex.pr) {
              hasPR = true;
              break;
            }
          }
        }
        if (hasPR) break;
      }
    }
    days.push({
      date: d,
      hasSession: dayLogs.length > 0,
      hasPR,
      logs: dayLogs,
    });
  }

  return days;
}

export function useHistoryMonth(): UseHistoryMonthReturn {
  const { token } = useAuth();
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState<MonthKey>({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const [monthData, setMonthData] = useState<MonthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const cacheRef = useRef<Map<string, MonthData>>(new Map());
  const initialFetchDone = useRef(false);

  const fetchMonth = useCallback(async (year: number, month: number) => {
    const key = monthKey(year, month);
    const cached = cacheRef.current.get(key);
    if (cached) {
      setMonthData(cached);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `/api/mobile/logs?year=${year}&month=${month}`;
      console.log('[useHistoryMonth] fetching', url);
      const data = await apiFetch<{ logs: WorkoutLogEntry[] }>(
        url,
        { token: token ?? undefined }
      );
      console.log('[useHistoryMonth] response', data.logs.length, 'logs');

      const days = buildCalendar(year, month, data.logs);
      const monthResult: MonthData = { logs: data.logs, days };
      cacheRef.current.set(key, monthResult);
      setMonthData(monthResult);
    } catch (err: any) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const goToMonth = useCallback((year: number, month: number) => {
    setCurrentMonth({ year, month });
    const today = new Date();
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
    setSelectedDay(isCurrentMonth ? today.getDate() : null);
    fetchMonth(year, month);
  }, [fetchMonth]);

  const goToPrevMonth = useCallback(() => {
    const { year, month } = currentMonth;
    if (month === 0) {
      goToMonth(year - 1, 11);
    } else {
      goToMonth(year, month - 1);
    }
  }, [currentMonth, goToMonth]);

  const goToNextMonth = useCallback(() => {
    const { year, month } = currentMonth;
    if (month === 11) {
      goToMonth(year + 1, 0);
    } else {
      goToMonth(year, month + 1);
    }
  }, [currentMonth, goToMonth]);

  const displayedLogs = selectedDay != null
    ? (monthData?.days.find(d => d.date === selectedDay)?.logs || [])
    : (monthData?.logs || []);

  return {
    currentMonth,
    monthData,
    loading,
    error,
    goToPrevMonth,
    goToNextMonth,
    goToMonth,
    selectedDay,
    setSelectedDay,
    displayedLogs,
  };
}
