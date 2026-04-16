import React from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	Platform,
	StatusBar,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ExercisePreviewCard } from "@/components/workout/ExercisePreviewCard";

export default function TodayPlanPreviewScreen() {
	const { planDay: planDayParam } = useLocalSearchParams<{
		planDay?: string;
	}>();

	if (!planDayParam) {
		return (
			<View className="flex-1 bg-black items-center justify-center">
				<Text className="text-white">Error loading plan.</Text>
				<TouchableOpacity onPress={() => router.back()} className="mt-4 p-4">
					<Text className="text-orange-500">Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	const planDay = JSON.parse(planDayParam);

	const handleStartSession = () => {
		const initialExercises = planDay.exercises.map((ex: any) => ({
			exerciseId: ex.exerciseId,
			name: ex.name,
			targetSets: ex.targetSets,
			targetReps: ex.targetReps,
			lastWeight: ex.lastWeight ?? 0,
			unit: ex.lastUnit ?? "kg",
			restDuration: ex.restDuration ?? 90,
			sets: Array.from({ length: ex.targetSets }, () => ({
				weight: ex.lastWeight ?? 0,
				reps: ex.targetReps,
				done: false,
			})),
		}));

		router.replace({
			pathname: "/workout/new",
			params: {
				exercises: JSON.stringify(initialExercises),
				sessionName: planDay.dayName,
			},
		});
	};

	const handleAddExtra = () => {
		router.push({
			pathname: "/workout/exercise-picker",
			params: {
				mode: "addToExisting",
				existingPlan: planDayParam,
			},
		});
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: "#000",
				paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
			}}>
			{/* Header */}
			<View className="flex-row items-center px-4 py-3">
				<TouchableOpacity
					onPress={() => router.back()}
					className="p-2 -ml-2 mr-2">
					<Text className="text-white text-xl">←</Text>
				</TouchableOpacity>
				<View className="bg-zinc-800 rounded-full px-3 py-1">
					<Text className="text-zinc-300 text-xs font-medium">
						Day {planDay.weekNumber ? `(Week ${planDay.weekNumber})` : ""}
					</Text>
				</View>
			</View>

			<ScrollView className="flex-1 px-4 pt-2">
				<Text className="text-white text-3xl font-bold mb-1">
					{planDay.planName}
				</Text>
				<Text className="text-zinc-400 text-base mb-8">{planDay.dayName}</Text>

				<Text className="text-zinc-300 font-medium mb-4 uppercase tracking-wider text-xs">
					Exercises
				</Text>

				{planDay.exercises.map((ex: any, idx: number) => (
					<ExercisePreviewCard key={`${ex.exerciseId}-${idx}`} exercise={ex} />
				))}

				<View className="h-32" />
			</ScrollView>

			{/* Bottom Actions */}
			<View className="absolute bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800">
				<TouchableOpacity
					onPress={handleAddExtra}
					activeOpacity={0.7}
					className="py-4 rounded-xl border border-zinc-600 mb-3 items-center">
					<Text className="text-zinc-300 font-medium">Add Extra Exercises</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={handleStartSession}
					activeOpacity={0.8}
					className="bg-orange-500 py-4 rounded-xl items-center">
					<Text className="text-white font-bold text-lg">Start Session</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
