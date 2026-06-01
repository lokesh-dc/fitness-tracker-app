import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { StickyBottomBar } from "../shared/StickyBottomBar";
import { StepIndicator } from "../shared/StepIndicator";
import { SessionExercise, SetEntry } from "../../../types/workout";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { WarmupBottomSheet } from "../WarmupBottomSheet";
import { RestTimerBar } from "../RestTimerBar";
import { PlateauBanner } from "../PlateauBanner";
import { PlateauDetailModal } from "../PlateauDetailModal";
import { PRCelebrationOverlay } from "../PRCelebrationOverlay";
import { useRestTimer } from "../../../hooks/useRestTimer";
import { OneRMSparkline } from "../OneRMSparkline";

interface ExerciseLogStepProps {
	exercise: SessionExercise;
	onSave: (updatedExercise: SessionExercise, prsHit: PRHit[]) => void;
	handleBack: () => void;
}

export const ExerciseLogStep: React.FC<ExerciseLogStepProps> = ({
	exercise,
	onSave,
	handleBack,
}) => {
	const [sets, setSets] = useState<SetEntry[]>(
		exercise.sets.length > 0
			? exercise.sets
			: [{ weight: "", reps: "", done: false }],
	);
	const [warmupVisible, setWarmupVisible] = useState(false);
	const [plateauModalVisible, setPlateauModalVisible] = useState(false);
	const [plateauDismissed, setPlateauDismissed] = useState(false);
	const [prsHitThisExercise, setPrsHitThisExercise] = useState<PRHit[]>([]);
	const [celebrationPR, setCelebrationPR] = useState<PRHit | null>(null);

	const {
		isActive,
		secondsRemaining,
		totalSeconds,
		startTimer,
		skipTimer,
		adjustTimer,
	} = useRestTimer();

	useEffect(() => {
		setSets(
			exercise.sets.length > 0
				? exercise.sets
				: [{ weight: "", reps: "", done: false }],
		);
		setPlateauDismissed(false);
		setPrsHitThisExercise([]);
	}, [exercise]);

	const isDone = exercise.isDone;

	const plateauData = exercise.plateauInfo;
	const history = plateauData?.history || [];
	const isWeightPlateau =
		history.length >= 3 &&
		history[0].maxWeight === history[1].maxWeight &&
		history[1].maxWeight === history[2].maxWeight;
	const isPlateaued = plateauData?.isPlateaued || isWeightPlateau;

	useEffect(() => {
		if (isPlateaued && !plateauDismissed) {
			const timer = setTimeout(() => setPlateauModalVisible(true), 400);
			return () => clearTimeout(timer);
		}
	}, [exercise.exerciseId, isPlateaued]);

	function checkForPR(set: SetEntry): PRHit | null {
		const weight = parseFloat(set.weight);
		const reps = parseInt(set.reps);

		if (!weight || !reps || weight <= 0 || reps <= 0) return null;

		if (weight > exercise.currentPR) {
			return {
				exerciseId: exercise.exerciseId,
				exerciseName: exercise.name,
				type: "WEIGHT",
				newValue: weight,
				previousValue: exercise.currentPR,
				setWeight: weight,
				setReps: reps,
			};
		}

		if (weight === exercise.currentPR && reps > exercise.currentPRReps) {
			return {
				exerciseId: exercise.exerciseId,
				exerciseName: exercise.name,
				type: "REPS",
				newValue: reps,
				previousValue: exercise.currentPRReps,
				setWeight: weight,
				setReps: reps,
			};
		}

		return null;
	}

	const handleUpdateSet = (
		index: number,
		field: keyof SetEntry,
		value: string | boolean,
	) => {
		const newSets = [...sets];
		const isMarkingDone = field === "done" && value === true;

		newSets[index] = { ...newSets[index], [field]: value };
		setSets(newSets);

		if (isMarkingDone) {
			const restDuration = exercise.restDuration ?? 90;
			startTimer(restDuration);

			const prHit = checkForPR(newSets[index]);
			if (prHit) {
				setPrsHitThisExercise((prev) => {
					const exists = prev.findIndex((p) => p.type === prHit.type);
					if (exists >= 0) {
						const newArray = [...prev];
						if (prHit.newValue > newArray[exists].newValue) {
							newArray[exists] = prHit;
						}
						return newArray;
					}
					return [...prev, prHit];
				});
			}
		}
	};

	const addSet = () => {
		const lastSet = sets[sets.length - 1];
		setSets([
			...sets,
			{ weight: lastSet?.weight || "", reps: "", done: false },
		]);
	};

	const removeSet = () => {
		if (sets.length > 1) {
			setSets(sets.slice(0, -1));
		}
	};

	const finishExercise = (
		callback: (savedEx: SessionExercise, prs: PRHit[]) => void,
	) => {
		const validSets = sets.filter(
			(s) => parseFloat(s.weight) > 0 && parseInt(s.reps) > 0,
		);

		const savedExercise = { ...exercise, sets: validSets, isDone: true };

		if (prsHitThisExercise.length > 0) {
			const topPR =
				prsHitThisExercise.find((p) => p.type === "WEIGHT") ??
				prsHitThisExercise[0];
			setCelebrationPR(topPR);

			setTimeout(() => {
				setCelebrationPR(null);
				callback(savedExercise, prsHitThisExercise);
			}, 2000);
		} else {
			callback(savedExercise, []);
		}
	};

	const handleSave = () => {
		finishExercise((savedEx, prs) => {
			onSave(savedEx, prs);
			handleBack();
		});
	};

	const handleSkip = () => {
		const skippedExercise = { ...exercise, isSkipped: true, isDone: false };
		onSave(skippedExercise, []);
		handleBack();
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1 bg-[#0a0a0a]">
			<View className="px-6 pt-4">
				<StepIndicator currentStep={4} />

				<View className="flex-row items-center justify-between mb-6">
					<TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
						<Ionicons name="chevron-back" color="white" size={28} />
					</TouchableOpacity>

					<View className="items-center flex-1 pr-8">
						<Text className="text-white font-bold text-xl text-center">
							{exercise.name} {isDone && "✓"}
						</Text>
						<View className="flex-row items-center gap-x-2 mt-1">
							<View className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
								<Text className="text-orange-500 text-[10px] font-bold uppercase tracking-wider">
									{exercise.muscleGroup}
								</Text>
							</View>
						</View>
					</View>
				</View>
				<View className="flex-row gap-x-3 mb-6 justify-center">
					<View className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl items-center flex-1">
						<Text className="text-orange-500 text-[9px] font-black uppercase mb-0.5 tracking-widest">
							Personal Record
						</Text>
						<Text className="text-white text-base font-bold">
							{exercise.currentPR > 0
								? `${exercise.currentPR} ${exercise.unit}`
								: "None"}
						</Text>
					</View>
					<View className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl items-center flex-1">
						<Text className="text-white/40 text-[9px] font-bold uppercase mb-0.5 tracking-widest">
							Target
						</Text>
						<Text className="text-white text-base font-bold">
							{exercise.targetSets} × {exercise.targetReps}
						</Text>
					</View>
				</View>
				{isPlateaued && !plateauDismissed && (
					<View className="mb-4">
						<PlateauBanner
							history={history}
							onViewDetails={() => setPlateauModalVisible(true)}
							onDismiss={() => setPlateauDismissed(true)}
						/>
					</View>
				)}
				{exercise.oneRMHistory && exercise.oneRMHistory.length > 0 && (
					<OneRMSparkline
						history={exercise.oneRMHistory}
						unit={exercise.unit}
					/>
				)}
			</View>

			<ScrollView
				className="flex-1 px-6"
				contentContainerStyle={{ paddingBottom: 150 }}>
				<View className="flex-row mb-4 px-2">
					<Text className="w-10 text-white/40 text-[10px] font-black uppercase tracking-widest">
						#
					</Text>
					<Text className="flex-1 text-white/40 text-[10px] font-black uppercase tracking-widest text-center">
						Weight ({exercise.unit})
					</Text>
					<Text className="flex-1 text-white/40 text-[10px] font-black uppercase tracking-widest text-center">
						Reps
					</Text>
					<Text className="w-10 text-white/40 text-[10px] font-black uppercase tracking-widest text-right">
						✓
					</Text>
				</View>

				{sets.map((set, index) => (
					<View
						key={index}
						className="flex-row items-center mb-3 bg-white/5 p-2 rounded-xl border border-white/5">
						<View className="w-10">
							<Text className="text-white/40 font-bold">{index + 1}</Text>
						</View>

						<View className="flex-1 px-2">
							<TextInput
								value={set.weight}
								onChangeText={(val) => handleUpdateSet(index, "weight", val)}
								keyboardType="numeric"
								placeholder={
									exercise.lastWeight > 0 ? exercise.lastWeight.toString() : "0"
								}
								placeholderTextColor="rgba(255,255,255,0.1)"
								className="text-white text-center font-bold text-lg border-b-2 border-transparent focus:border-orange-500 py-1"
							/>
						</View>

						<View className="flex-1 px-2">
							<TextInput
								value={set.reps}
								onChangeText={(val) => handleUpdateSet(index, "reps", val)}
								keyboardType="numeric"
								placeholder={exercise.targetReps.toString()}
								placeholderTextColor="rgba(255,255,255,0.1)"
								className="text-white text-center font-bold text-lg border-b-2 border-transparent focus:border-orange-500 py-1"
							/>
						</View>

						<TouchableOpacity
							onPress={() => handleUpdateSet(index, "done", !set.done)}
							className={`w-10 h-10 rounded-full border items-center justify-center ${
								set.done ? "bg-orange-500 border-orange-500" : "border-white/20"
							}`}>
							{set.done && (
								<Ionicons name="checkmark" size={24} color="white" />
							)}
						</TouchableOpacity>
					</View>
				))}

				<View className="flex-row gap-x-4 mt-4">
					<TouchableOpacity
						onPress={addSet}
						className="flex-1 py-3 rounded-xl border border-orange-500/30 bg-orange-500/5 items-center flex-row justify-center gap-x-2">
						<Feather name="plus" size={16} color="#f97316" />
						<Text className="text-orange-500 font-bold text-sm">Add Set</Text>
					</TouchableOpacity>

					{sets.length > 1 && (
						<TouchableOpacity
							onPress={removeSet}
							className="flex-1 py-3 rounded-xl border border-red-500/30 bg-red-500/5 items-center flex-row justify-center gap-x-2">
							<Feather name="minus" size={16} color="#ef4444" />
							<Text className="text-red-500 font-bold text-sm">Remove Set</Text>
						</TouchableOpacity>
					)}
				</View>
			</ScrollView>

			{isActive && (
				<RestTimerBar
					secondsRemaining={secondsRemaining}
					totalSeconds={totalSeconds}
					onSkip={skipTimer}
					onAdjust={adjustTimer}
				/>
			)}

			<WarmupBottomSheet
				visible={warmupVisible}
				onClose={() => setWarmupVisible(false)}
				exercise={exercise}
			/>

			<PlateauDetailModal
				visible={plateauModalVisible}
				history={exercise.plateauInfo?.history ?? []}
				exerciseName={exercise.name}
				onClose={() => setPlateauModalVisible(false)}
			/>

			<StickyBottomBar
				primaryLabel={isDone ? "Update Exercise ✓" : "Save Exercise ✓"}
				onPrimary={handleSave}>
				<View className="flex-row gap-x-3 mb-4">
					<TouchableOpacity
						onPress={() => setWarmupVisible(true)}
						className="flex-1 py-4 rounded-2xl bg-white/5 border border-orange-500/30 flex-row items-center justify-center">
						<Text className="text-orange-500 text-xs font-black uppercase tracking-widest mr-2">
							Warmup
						</Text>
						<Feather name="external-link" size={14} color="#f97316" />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => setPlateauModalVisible(true)}
						className={`flex-1 py-4 rounded-2xl flex-row items-center justify-center ${
							isPlateaued
								? "bg-amber-500/10 border border-amber-500/40"
								: "bg-white/5 border border-white/10"
						}`}>
						<Text
							className={`text-xs font-black uppercase tracking-widest mr-2 ${
								isPlateaued ? "text-amber-500" : "text-white/40"
							}`}>
							History {isPlateaued ? "(Plateau)" : ""}
						</Text>
						<Ionicons
							name={isPlateaued ? "alert-circle" : "time-outline"}
							size={16}
							color={isPlateaued ? "#f59e0b" : "rgba(255,255,255,0.4)"}
						/>
					</TouchableOpacity>
				</View>

				<TouchableOpacity
					onPress={handleSkip}
					className="w-full py-3 items-center justify-center mb-2">
					<Text className="text-white/30 text-[10px] font-black uppercase tracking-[3px]">
						Skip Exercise
					</Text>
				</TouchableOpacity>
			</StickyBottomBar>

			{celebrationPR && <PRCelebrationOverlay pr={celebrationPR} />}
		</KeyboardAvoidingView>
	);
};
