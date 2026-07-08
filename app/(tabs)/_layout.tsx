import { Tabs, Redirect, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { ActivityIndicator, View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomTabBar } from "@/components/CustomTabBar";
import { ProfileIcon } from "@/components/TabIcons";

export default function TabsLayout() {
	const { user, isLoading } = useAuth();
	const insets = useSafeAreaInsets();
	const router = useRouter();

	if (isLoading) {
		return (
			<View className="flex-1 bg-black items-center justify-center">
				<ActivityIndicator color="#f97316" />
			</View>
		);
	}

	if (!user) return <Redirect href="/(auth)/login" />;

	return (
		<View className="flex-1">
			<Tabs
				screenOptions={{
					headerShown: false,
				}}
				tabBar={(props) => <CustomTabBar {...props} />}>
				<Tabs.Screen name="index" options={{ title: "Home" }} />
				<Tabs.Screen name="history" options={{ title: "History" }} />
				<Tabs.Screen name="plans" options={{ title: "Plans" }} />
				<Tabs.Screen name="analytics" options={{ title: "Analytics" }} />
				<Tabs.Screen
					name="profile"
					options={{ title: "Profile", tabBarButton: () => null }}
				/>
			</Tabs>

			<TouchableOpacity
				onPress={() => router.push("/(tabs)/profile")}
				activeOpacity={0.7}
				style={{
					position: "absolute",
					top: insets.top + 8,
					right: 16,
					width: 40,
					height: 40,
					borderRadius: 20,
					backgroundColor: "rgba(255,255,255,0.08)",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 50,
				}}
			>
				<ProfileIcon color="#fff" size={22} />
			</TouchableOpacity>
		</View>
	);
}
