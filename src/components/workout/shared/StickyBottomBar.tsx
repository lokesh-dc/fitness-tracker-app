import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface StickyBottomBarProps {
	primaryLabel: string;
	onPrimary: () => void;
	primaryDisabled?: boolean;
	secondaryLabel?: string;
	onSecondary?: () => void;
	hint?: string;
	children?: React.ReactNode;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({
	primaryLabel,
	onPrimary,
	primaryDisabled = false,
	secondaryLabel,
	onSecondary,
	hint,
	children,
}) => {
	const insets = useSafeAreaInsets();

	return (
		<View
			className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#0a0a0a]/95"
			style={{
				paddingBottom: Math.max(insets.bottom, 12) + 12,
			}}>
			<View className="px-6 pt-4">
				{hint && (
					<Text className="text-center text-white/40 text-xs mb-3 font-medium">
						{hint}
					</Text>
				)}
				{children}

				<View className="gap-y-3">
					{secondaryLabel && onSecondary && (
						<TouchableOpacity
							onPress={onSecondary}
							className="py-3 items-center">
							<Text className="text-white/60 text-sm font-semibold">
								{secondaryLabel}
							</Text>
						</TouchableOpacity>
					)}

					<TouchableOpacity
						onPress={onPrimary}
						disabled={primaryDisabled}
						activeOpacity={0.8}
						className={`py-4 rounded-2xl items-center shadow-lg shadow-orange-500/20 ${
							primaryDisabled ? "bg-orange-500/30" : "bg-orange-500"
						}`}>
						<Text
							className={`text-base font-bold ${primaryDisabled ? "text-white/40" : "text-white"}`}>
							{primaryLabel}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};
