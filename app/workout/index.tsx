import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { apiFetch } from "../../src/lib/api";
import { WorkoutFlow } from "../../src/components/workout/WorkoutFlow";
import { SessionExercise, WorkoutMode } from "../../src/types/workout";
import { SafeAreaView } from "react-native-safe-area-context";
import { SessionStorage } from "../../src/lib/storage";

interface WorkoutSetupResponse {
	lastLog: any | null;
	todayLog: any | null;
	activePlan: any | null;
	exerciseRecords: any[];
	userUnit: "kg" | "lb";
	lastBodyWeight: number | null;
	plateauData: Record<string, any>;
}

export default function WorkoutScreen() {
	const { token } = useAuth();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [setupData, setSetupData] = useState<WorkoutSetupResponse | null>(null);
	const [exercises, setExercises] = useState<SessionExercise[]>([]);
	const [initialBodyWeight, setInitialBodyWeight] = useState("");
	const [initialStartedAt, setInitialStartedAt] = useState<Date | null>(null);

	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await apiFetch<WorkoutSetupResponse>("/api/workout/setup", {
				token: token || undefined,
			});
			setSetupData(data);

			let sessionExercises: SessionExercise[] = [];

			// 1. Determine base exercises
			const jsDay = new Date().getDay();
			const promptDay = (jsDay + 6) % 7; // Map JS 0=Sun to Prompt 6=Sun, JS 1=Mon to Prompt 0=Mon

			const templates = data.activePlan?.templates || [];
			const todayTemplate =
				templates.find((t: any) => t.dayOfWeek === jsDay) || // Try matching backend jsDay first
				templates.find((t: any) => t.dayOfWeek === promptDay); // Fallback to prompt mapping

			const lastLog = data.lastLog;
			const todayLog = data.todayLog;
			const records = data.exerciseRecords;

			if (todayTemplate && todayTemplate.exercises?.length > 0) {
				sessionExercises = todayTemplate.exercises.map((ex: any) => {
					// Check if this exercise was already logged today (e.g. on website)
					const matchingLogEx = todayLog?.exercises?.find((le: any) => {
						const leId = le.exerciseId ? String(le.exerciseId) : null;
						const exId = ex.exerciseId ? String(ex.exerciseId) : null;
						return (
							(leId && exId && leId === exId) ||
							le.name?.toLowerCase().trim() === ex.name?.toLowerCase().trim()
						);
					});

					const lastEx = lastLog?.exercises?.find(
						(le: any) => String(le.exerciseId) === String(ex.exerciseId),
					);
					const record = records.find(
						(r: any) =>
							r.exerciseName === ex.name || r.exerciseId === ex.exerciseId,
					);

					return {
						exerciseId: String(ex.exerciseId),
						name: ex.name,
						muscleGroup: ex.muscleGroup || "General",
						targetSets: ex.targetSets || 3,
						targetReps: ex.targetReps || 10,
						lastWeight:
							ex.lastWeight ||
							data.plateauData?.[String(ex.exerciseId)]?.lastWeight ||
							lastEx?.sets?.[0]?.weight ||
							0,
						currentPR:
							record?.currentPR ||
							data.plateauData?.[String(ex.exerciseId)]?.localMaxWeight ||
							0,
						currentPRReps:
							record?.currentPRReps ||
							data.plateauData?.[String(ex.exerciseId)]?.localMaxReps ||
							0,
						unit: data.userUnit,
						isDone: !!matchingLogEx,
						plateauInfo: data.plateauData?.[String(ex.exerciseId)] || null,
						oneRMHistory: record?.oneRMHistory ?? [],
						sets:
							matchingLogEx?.sets?.map((s: any) => ({
								weight: s.weight.toString(),
								reps: s.reps.toString(),
								done: true,
							})) ||
							lastEx?.sets?.map((s: any) => ({
								weight: s.weight.toString(),
								reps: s.reps.toString(),
								done: false,
							})) ||
							Array.from({ length: ex.targetSets || 3 }).map(() => ({
								weight: "",
								reps: "",
								done: false,
							})),
					};
				});
			} else if (todayLog && todayLog.exercises?.length > 0) {
				// If no template but we have today's log, use the log itself
				sessionExercises = todayLog.exercises.map((ex: any) => {
					const record = records.find(
						(r: any) =>
							r.exerciseName === ex.name || r.exerciseId === ex.exerciseId,
					);
					return {
						exerciseId: String(ex.exerciseId),
						name: ex.name,
						muscleGroup: ex.muscleGroup || "General",
						targetSets: ex.sets?.length || 3,
						targetReps: ex.sets?.[0]?.reps || 10,
						lastWeight:
							ex.lastWeight ||
							data.plateauData?.[String(ex.exerciseId)]?.lastWeight ||
							ex.sets?.[0]?.weight ||
							0,
						currentPR:
							record?.currentPR ||
							data.plateauData?.[String(ex.exerciseId)]?.localMaxWeight ||
							0,
						currentPRReps:
							record?.currentPRReps ||
							data.plateauData?.[String(ex.exerciseId)]?.localMaxReps ||
							0,
						unit: data.userUnit,
						isDone: true,
						plateauInfo: data.plateauData?.[String(ex.exerciseId)] || null,
						oneRMHistory: record?.oneRMHistory ?? [],
						sets: ex.sets?.map((s: any) => ({
							weight: s.weight.toString(),
							reps: s.reps.toString(),
							done: true,
						})),
					};
				});
			} else {
				// Fallback to last log weights if no template or today log
				sessionExercises = (lastLog?.exercises || []).map((ex: any) => {
					const record = records.find(
						(r: any) =>
							r.exerciseName === ex.name || r.exerciseId === ex.exerciseId,
					);
					return {
						exerciseId: String(ex.exerciseId),
						name: ex.name,
						muscleGroup: ex.muscleGroup || "General",
						targetSets: ex.sets?.length || 3,
						targetReps: ex.sets?.[0]?.reps || 10,
						lastWeight: ex.sets?.[0]?.weight || 0,
						currentPR: record?.currentPR || 0,
						currentPRReps: record?.currentPRReps || 0,
						unit: data.userUnit,
						isDone: false,
						plateauInfo: data.plateauData?.[String(ex.exerciseId)] || null,
						oneRMHistory: record?.oneRMHistory ?? [],
						sets: ex.sets?.map((s: any) => ({
							weight: s.weight.toString(),
							reps: s.reps.toString(),
							done: false,
						})),
					};
				});
			}

			// 2. Check for persisted session to resume
			const persisted = await SessionStorage.getSession();
			if (persisted) {
				const isSameDay =
					new Date(persisted.lastUpdated).toDateString() ===
					new Date().toDateString();

				if (isSameDay && persisted.exercises?.length > 0) {
					// SMART MERGE: API data (website) + Local data (mobile)
					sessionExercises = sessionExercises.map((apiEx) => {
						const localEx = persisted.exercises.find(
							(le) => String(le.exerciseId) === String(apiEx.exerciseId),
						);
						if (!localEx) return apiEx;

						// If website marked it done, it stays done.
						// Otherwise, use local state (which might have progress)
						return apiEx.isDone ? apiEx : localEx;
					});

					// Keep any "Log Again" extra exercises from local
					const extraLocal = persisted.exercises.filter(
						(le) =>
							!sessionExercises.some(
								(ae) => String(ae.exerciseId) === String(le.exerciseId),
							),
					);
					sessionExercises = [...sessionExercises, ...extraLocal];

					setInitialBodyWeight(persisted.bodyWeight || "");
					setInitialStartedAt(
						persisted.startedAt ? new Date(persisted.startedAt) : null,
					);
				}
			}

			setExercises(sessionExercises);
		} catch (err: any) {
			setError(err.message || "Failed to fetch workout data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	if (loading) {
		return (
			<View className="flex-1 bg-[#0a0a0a] items-center justify-center">
				<ActivityIndicator size="large" color="#f97316" />
				<Text className="text-white/40 mt-4 font-medium tracking-widest uppercase text-[10px]">
					Preparing Session
				</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View className="flex-1 bg-[#0a0a0a] items-center justify-center px-6">
				<Text className="text-red-500 text-center mb-6 font-medium">
					{error}
				</Text>
				<TouchableOpacity
					onPress={fetchData}
					className="bg-orange-500 px-8 py-3 rounded-2xl">
					<Text className="text-white font-bold">Retry</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-[#0a0a0a]" edges={["top"]}>
			<WorkoutFlow
				initialExercises={exercises}
				lastBodyWeight={setupData?.lastBodyWeight || null}
				workoutName={setupData?.activePlan?.name || "Quick Workout"}
				splitName={
					setupData?.activePlan?.splitName || setupData?.activePlan?.name || ""
				}
				unit={setupData?.userUnit || "kg"}
				mode="LIVE_SESSION"
				plateauData={setupData?.plateauData || {}}
				initialBodyWeight={initialBodyWeight}
				initialStartedAt={initialStartedAt}
			/>
		</SafeAreaView>
	);
}
