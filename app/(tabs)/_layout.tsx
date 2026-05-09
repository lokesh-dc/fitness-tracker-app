import { Tabs } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<View className="flex-1 bg-black items-center justify-center">
				<ActivityIndicator color="#f97316" />
			</View>
		);
	}

	if (!user) return <Redirect href="/(auth)/login" />;

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: "#0a0a0a",
					borderTopColor: "rgba(255,255,255,0.08)",
				},
				tabBarActiveTintColor: "#f97316",
				tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="history"
				options={{
					title: "History",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="time-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="plans"
				options={{
					title: "Plans",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="list-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="analytics"
				options={{
					title: "Analytics",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="stats-chart-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person-outline" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
