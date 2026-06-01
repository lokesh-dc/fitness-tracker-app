import React, { useMemo, useState } from "react";
import { View, Text, LayoutChangeEvent } from "react-native";
import Svg, { Polyline, Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { OneRMHistoryEntry } from "../../types/workout";

interface OneRMSparklineProps {
	history: OneRMHistoryEntry[]; // up to 5 entries, oldest → newest
	unit: "kg" | "lb";
}

export const OneRMSparkline: React.FC<OneRMSparklineProps> = ({
	history,
	unit,
}) => {
	const [width, setWidth] = useState(0);
	const height = 40;
	const padding = 12;

	const onLayout = (event: LayoutChangeEvent) => {
		setWidth(event.nativeEvent.layout.width - padding * 2);
	};

	const points = useMemo(() => {
		if (history.length < 1 || width === 0) return "";

		const values = history.map((h) => h.estimated1RM);
		const min = Math.min(...values);
		const max = Math.max(...values);
		const range = max - min;

		return values
			.map((val, i) => {
				const x = (i / (history.length - 1 || 1)) * width;
				const y =
					range === 0
						? height / 2
						: height - ((val - min) / range) * height;
				return `${x},${y}`;
			})
			.join(" ");
	}, [history, width]);

	const current1RM = history[history.length - 1]?.estimated1RM || 0;

	if (history.length === 0) return null;

	return (
		<View 
            className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-4 overflow-hidden"
            onLayout={onLayout}
        >
			<View className="flex-row justify-between items-end mb-4">
				<View>
					<Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">
						Est. 1RM
					</Text>
					<Text className="text-orange-500 text-2xl font-bold tabular-nums">
						{current1RM.toFixed(1)} <Text className="text-sm font-normal">{unit}</Text>
					</Text>
				</View>
				
				{/* Simple Min/Max Indicator */}
				<View className="items-end">
					<Text className="text-white/20 text-[9px] font-medium uppercase">Range</Text>
					<Text className="text-white/40 text-[10px] font-bold">
						{Math.min(...history.map(h => h.estimated1RM)).toFixed(0)} - {Math.max(...history.map(h => h.estimated1RM)).toFixed(0)}
					</Text>
				</View>
			</View>

			<View style={{ height, width: '100%' }}>
				{width > 0 && (
					<Svg height={height} width={width}>
						<Defs>
							<RadialGradient id="glow" cx="50%" cy="50%" rx="50%" ry="50%">
								<Stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
								<Stop offset="100%" stopColor="#f97316" stopOpacity="0" />
							</RadialGradient>
						</Defs>
						
						{history.length > 1 && (
							<Polyline
								points={points}
								fill="none"
								stroke="#f97316"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						)}

						{history.map((h, i) => {
							const values = history.map((v) => v.estimated1RM);
							const min = Math.min(...values);
							const max = Math.max(...values);
							const range = max - min;
							
							const x = (i / (history.length - 1 || 1)) * width;
							const y = range === 0 ? height / 2 : height - ((h.estimated1RM - min) / range) * height;
							const isLast = i === history.length - 1;

							return (
								<React.Fragment key={i}>
									{isLast && (
										<Circle cx={x} cy={y} r="8" fill="url(#glow)" />
									)}
									<Circle
										cx={x}
										cy={y}
										r={isLast ? "4" : "2"}
										fill="#f97316"
									/>
								</React.Fragment>
							);
						})}
					</Svg>
				)}
			</View>

			{/* Date Labels */}
			<View className="flex-row justify-between mt-2">
				{history.map((h, i) => {
                    const date = new Date(h.date);
                    const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    return (
                        <Text key={i} className="text-white/20 text-[8px] font-medium">
                            {label}
                        </Text>
                    );
                })}
			</View>
		</View>
	);
};
