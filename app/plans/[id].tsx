import { useEffect, useState, useCallback } from "react";
import {
	View,
	Text,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity,
	RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Plan, PlanDay } from "@/types/plan";
import { WeekStrip } from "@/components/plans/WeekStrip";
import { DayExerciseList } from "@/components/plans/DayExerciseList";
import { StatusBadge } from "@/components/plans/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

// Returns dayOfWeek indexes (0=Mon…6=Sun) that have a WorkoutLog this week
async function fetchLoggedDaysThisWeek(token: string): Promise<number[]> {
	try {
		// Get start of current week (Monday)
		const now = new Date();
		const jsDay = now.getDay();
		const diffToMonday = jsDay === 0 ? -6 : 1 - jsDay;
		const monday = new Date(now);
		monday.setDate(now.getDate() + diffToMonday);
		monday.setHours(0, 0, 0, 0);

		const sunday = new Date(monday);
		sunday.setDate(monday.getDate() + 6);
		sunday.setHours(23, 59, 59, 999);

		const data = await apiFetch<{ logs: { date: string }[] }>(
			`/api/logs?from=${monday.toISOString().split("T")[0]}&to=${sunday.toISOString().split("T")[0]}`,
			{ token },
		);

		return data.logs.map((log) => {
			const d = new Date(log.date);
			const jsDay = d.getDay();
			return jsDay === 0 ? 6 : jsDay - 1; // convert JS Sunday=0 → Monday=0
		});
	} catch {
		return []; // fail silently — logged days are cosmetic
	}
}

export default function PlanDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { token } = useAuth();

	const [plan, setPlan] = useState<Plan | null>(null);
	const [loggedDays, setLoggedDays] = useState<number[]>([]);
	const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function loadData(isRefresh = false) {
		if (isRefresh) setIsRefreshing(true);
		else setIsLoading(true);
		setError(null);

		// Parallel fetch — one failure must not crash the screen
		const [planResult, loggedResult] = await Promise.all([
			apiFetch<{ plan: Plan }>(`/api/plans/${id}`, { token: token! })
				.then((d) => ({ data: d.plan, error: null }))
				.catch((e) => ({ data: null, error: e.message })),

			fetchLoggedDaysThisWeek(token!).then((days) => ({
				data: days,
				error: null,
			})),
		]);

		if (planResult.data) {
			setPlan(planResult.data);

			// Auto-select today's day if it's in the plan, otherwise first day
			const todayJs = new Date().getDay();
			const todayIndex = todayJs;
			const todayDay = planResult.data.days.find(
				(d) => d.dayOfWeek === todayIndex,
			);
			setSelectedDayOfWeek(
				todayDay ? todayIndex : (planResult.data.days[0]?.dayOfWeek ?? null),
			);
		} else {
			setError(planResult.error ?? "Failed to load plan");
		}

		setLoggedDays(loggedResult.data ?? []);
		setIsLoading(false);
		setIsRefreshing(false);
	}

	useEffect(() => {
		loadData();
	}, [id]);

	const selectedDay =
		plan?.days.find((d) => d.dayOfWeek === selectedDayOfWeek) ?? null;

	if (isLoading) {
		return (
			<SafeAreaView className="flex-1 bg-black items-center justify-center">
				<ActivityIndicator color="#f97316" />
			</SafeAreaView>
		);
	}

	if (error || !plan) {
		return (
			<SafeAreaView className="flex-1 bg-black items-center justify-center px-6">
				<Text className="text-white/40 text-base text-center mb-4">
					{error ?? "Plan not found"}
				</Text>
				<TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
					<Text className="text-primary text-sm">← Go back</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-black">
			{/* Header */}
			<View className="flex-row items-center gap-3 px-4 pt-2 pb-4">
				<TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
					<Text className="text-white/50 text-base">←</Text>
				</TouchableOpacity>
				<View className="flex-1">
					<Text className="text-white text-lg font-medium">{plan.name}</Text>
					<View className="flex-row items-center gap-2 mt-0.5">
						<StatusBadge status={plan.status} />
						<Text className="text-white/30 text-xs">
							{plan.weeksCount > 0 ? `${plan.weeksCount} weeks · ` : ""}
							{plan.days.length} days/week
						</Text>
					</View>
				</View>
			</View>

			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={() => loadData(true)}
						tintColor="#f97316"
					/>
				}>
				{/* Week strip */}
				<View className="mb-4">
					<Text className="text-white/40 text-xs font-medium uppercase tracking-wider px-4 mb-3">
						This week
					</Text>
					<WeekStrip
						days={plan.days}
						selectedDayIndex={selectedDayOfWeek}
						loggedDayIndexes={loggedDays}
						onSelectDay={setSelectedDayOfWeek}
					/>
				</View>

				{/* Selected day exercises */}
				{selectedDay ? (
					<DayExerciseList day={selectedDay} planName={plan.name} />
				) : (
					<View className="items-center py-12">
						<Text className="text-white/30 text-sm">
							Tap a day above to see its exercises
						</Text>
					</View>
				)}

				<View className="h-12" />
			</ScrollView>
		</SafeAreaView>
	);
}
