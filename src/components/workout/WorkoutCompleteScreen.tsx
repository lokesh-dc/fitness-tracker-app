import React, { useEffect, useRef } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Animated,
	Platform,
	ToastAndroid,
	Alert,
} from "react-native";
import { SessionExercise, PRHit, WorkoutSession } from "../../types/workout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useWorkoutSave } from "../../hooks/useWorkoutSave";
import { ActivityIndicator } from "react-native";

interface WorkoutCompleteScreenProps {
	exercises: SessionExercise[];
	sessionPRs: PRHit[];
	startedAt: Date | null;
	bodyWeight: string;
	onDone: () => void;
	session: WorkoutSession;
}

export const WorkoutCompleteScreen: React.FC<WorkoutCompleteScreenProps> = ({
	exercises,
	sessionPRs,
	startedAt,
	bodyWeight,
	onDone,
	session,
}) => {
	const insets = useSafeAreaInsets();
	const { save, isSaving, error, savedLogId } = useWorkoutSave();
	const [saveAttempted, setSaveAttempted] = React.useState(false);

	// Animations
	const headerAnim = useRef(new Animated.Value(0)).current;
	const statsAnim = useRef(new Animated.Value(0)).current;
	const prsAnim = useRef(new Animated.Value(0)).current;
	const exercisesAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.stagger(200, [
			Animated.timing(headerAnim, {
				toValue: 1,
				duration: 400,
				useNativeDriver: true,
			}),
			Animated.timing(statsAnim, {
				toValue: 1,
				duration: 400,
				useNativeDriver: true,
			}),
			Animated.timing(prsAnim, {
				toValue: 1,
				duration: 400,
				useNativeDriver: true,
			}),
			Animated.timing(exercisesAnim, {
				toValue: 1,
				duration: 400,
				useNativeDriver: true,
			}),
		]).start();

		// Auto-save on mount
		if (!saveAttempted) {
			setSaveAttempted(true);
			save(session);
		}
	}, []);

	// Calculations
	const durationMs = startedAt ? Date.now() - startedAt.getTime() : 0;
	const durationMinutes = Math.round(durationMs / 60000);
	const durationDisplay =
		durationMinutes >= 60
			? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
			: `${durationMinutes}m`;

	const weightKg = parseFloat(bodyWeight) || 75;
	const calories = Math.round(5 * weightKg * (durationMinutes / 60));

	const totalVolume = exercises.reduce((acc, ex) => {
		return (
			acc +
			ex.sets
				.filter((s) => s.done)
				.reduce(
					(setAcc, s) => setAcc + parseFloat(s.weight) * parseInt(s.reps),
					0,
				)
		);
	}, 0);

	const unit = exercises[0]?.unit || "kg";
	const todayDate = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		day: "numeric",
		month: "short",
	});

	const handleShare = () => {
		if (Platform.OS === "android") {
			ToastAndroid.show("Coming soon", ToastAndroid.SHORT);
		} else {
			Alert.alert("Coming soon");
		}
	};

	return (
		<View className="flex-1 bg-[#0a0a0a]" style={{ paddingTop: insets.top }}>
			<ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
				{/* Header */}
				<Animated.View
					style={{ opacity: headerAnim }}
					className="px-6 pt-10 pb-6 items-center">
					<Text className="text-4xl mb-4">🎉</Text>
					<Text className="text-white text-2xl font-bold mb-1">
						Workout Complete!
					</Text>
					<Text className="text-white/40 text-sm font-medium">{todayDate}</Text>
				</Animated.View>

				{/* Stats Pills */}
				<Animated.View
					style={{
						opacity: statsAnim,
						transform: [
							{
								translateY: statsAnim.interpolate({
									inputRange: [0, 1],
									outputRange: [20, 0],
								}),
							},
						],
					}}
					className="flex-row px-6 gap-x-3 mb-10">
					<View className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 items-center">
						<Text className="text-white text-base font-bold mb-0.5">
							{durationDisplay}
						</Text>
						<Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
							Time
						</Text>
					</View>
					<View className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 items-center">
						<Text className="text-white text-base font-bold mb-0.5">
							{totalVolume.toLocaleString()}
						</Text>
						<Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
							{unit}
						</Text>
					</View>
					<View className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 items-center">
						<Text className="text-white text-base font-bold mb-0.5">
							~{calories}
						</Text>
						<Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
							kcal
						</Text>
					</View>
					<View className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 items-center">
						<Text
							className={`text-base font-bold mb-0.5 ${sessionPRs.length > 0 ? "text-orange-500" : "text-white/40"}`}>
							{sessionPRs.length}
						</Text>
						<Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
							PRs
						</Text>
					</View>
				</Animated.View>

				{/* PRs Section */}
				{sessionPRs.length > 0 && (
					<Animated.View
						style={{
							opacity: prsAnim,
							transform: [
								{
									translateY: prsAnim.interpolate({
										inputRange: [0, 1],
										outputRange: [20, 0],
									}),
								},
							],
						}}
						className="px-6 mb-10">
						<View className="flex-row items-center mb-4">
							<View className="flex-1 h-[1px] bg-white/10" />
							<Text className="text-white/40 text-xs font-bold uppercase tracking-widest px-4">
								PRs This Session
							</Text>
							<View className="flex-1 h-[1px] bg-white/10" />
						</View>

						<View className="gap-y-3">
							{sessionPRs.map((pr, index) => {
								const isWeightPR = pr.type === "WEIGHT";
								const bgClass = isWeightPR
									? "bg-amber-500/10 border-amber-500/20"
									: "bg-indigo-500/10 border-indigo-500/20";
								const textClass = isWeightPR
									? "text-amber-500"
									: "text-indigo-400";
								const valueText = isWeightPR
									? `${pr.setWeight} ${unit} × ${pr.setReps} reps`
									: `${pr.setWeight} ${unit} × ${pr.setReps} reps (↑ from ${pr.previousValue})`;

								return (
									<View
										key={index}
										className={`flex-row items-center border p-3 rounded-xl ${bgClass}`}>
										<Text className="mr-3 text-base">🏆</Text>
										<View className="flex-1">
											<Text className="text-white font-bold mb-0.5">
												{pr.exerciseName}
											</Text>
											<Text className={`${textClass} text-xs font-medium`}>
												{valueText}
											</Text>
										</View>
									</View>
								);
							})}
						</View>
					</Animated.View>
				)}

				{/* Exercises Section */}
				<Animated.View
					style={{
						opacity: exercisesAnim,
						transform: [
							{
								translateY: exercisesAnim.interpolate({
									inputRange: [0, 1],
									outputRange: [20, 0],
								}),
							},
						],
					}}
					className="px-6 mb-10">
					<View className="flex-row items-center mb-4">
						<View className="flex-1 h-[1px] bg-white/10" />
						<Text className="text-white/40 text-xs font-bold uppercase tracking-widest px-4">
							Exercises
						</Text>
						<View className="flex-1 h-[1px] bg-white/10" />
					</View>

					<View className="gap-y-4">
						{exercises.map((ex, index) => {
							const completedSets = ex.sets.filter((s) => s.done);
							const exVolume = completedSets.reduce(
								(acc, s) => acc + parseFloat(s.weight) * parseInt(s.reps),
								0,
							);

							if (!ex.isDone || completedSets.length === 0) {
								return (
									<View
										key={index}
										className="flex-row items-center justify-between opacity-40">
										<Text className="text-white font-bold line-through">
											{ex.name}
										</Text>
										<Text className="text-white/60 text-sm">Skipped</Text>
									</View>
								);
							}

							return (
								<View
									key={index}
									className="flex-row items-center justify-between">
									<Text className="text-white font-bold flex-1">{ex.name}</Text>
									<Text className="text-white/60 text-sm">
										{completedSets.length} sets · {exVolume.toLocaleString()}{" "}
										{unit}
									</Text>
								</View>
							);
						})}
					</View>
				</Animated.View>

				{/* Bottom CTAs */}
				<View className="px-6 gap-y-4">
					{/* Save Status UI */}
					<View className="items-center py-2">
						{isSaving && (
							<View className="flex-row items-center">
								<ActivityIndicator
									size="small"
									color="#f97316"
									className="mr-2"
								/>
								<Text className="text-white/40 text-sm font-medium">
									Saving workout...
								</Text>
							</View>
						)}
						{!isSaving && savedLogId && (
							<View className="flex-row items-center">
								<Feather
									name="check-circle"
									size={14}
									color="#22c55e"
									className="mr-2"
								/>
								<Text className="text-green-500 text-sm font-bold">
									Workout saved
								</Text>
							</View>
						)}
						{!isSaving && error && (
							<TouchableOpacity
								onPress={() => save(session)}
								className="flex-row items-center bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
								<Feather
									name="alert-triangle"
									size={14}
									color="#f59e0b"
									className="mr-2"
								/>
								<Text className="text-amber-500 text-sm font-bold">
									Save failed. Tap to retry
								</Text>
							</TouchableOpacity>
						)}
					</View>

					<TouchableOpacity
						onPress={onDone}
						disabled={isSaving}
						className={`py-4 rounded-2xl items-center flex-row justify-center ${isSaving ? "bg-orange-500/50" : "bg-orange-500"}`}>
						<Text className="text-white font-bold text-base mr-2">Done</Text>
						<Feather name="check" size={20} color="white" />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleShare}
						className="border border-white/20 py-4 rounded-2xl items-center">
						<Text className="text-white/80 font-bold text-base">
							Share Workout
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
};
