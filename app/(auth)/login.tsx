import { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

export default function LoginScreen() {
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	async function handleLogin() {
		if (!email.trim() || !password.trim()) {
			setError("Email and password are required");
			return;
		}
		setError(null);
		setIsLoading(true);
		try {
			const data = await login(email.trim().toLowerCase(), password);
			router.replace("/(tabs)/");
		} catch (e: any) {
			setError(e.message ?? "Sign in failed. Check your credentials.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<View className="flex-1 bg-black">
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1">
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					keyboardShouldPersistTaps="handled">
					<View className="flex-1 px-6 pt-24 pb-12 justify-between">
						{/* Header */}
						<View>
							<View className="w-12 h-12 rounded-2xl bg-primary items-center justify-center mb-6">
								<Text className="text-white text-xl font-medium">F</Text>
							</View>
							<Text className="text-white text-3xl font-medium mb-2">
								Welcome back
							</Text>
							<Text className="text-white/50 text-base">
								Sign in to continue tracking your progress
							</Text>
						</View>

						{/* Form */}
						<View className="gap-4">
							{/* Error banner */}
							{error && (
								<View className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
									<Text className="text-red-400 text-sm">{error}</Text>
								</View>
							)}

							{/* Email */}
							<View>
								<Text className="text-white/60 text-sm mb-2 ml-1">Email</Text>
								<TextInput
									value={email}
									onChangeText={setEmail}
									placeholder="you@example.com"
									placeholderTextColor="rgba(255,255,255,0.2)"
									autoCapitalize="none"
									autoComplete="email"
									keyboardType="email-address"
									returnKeyType="next"
									className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-base"
								/>
							</View>

							{/* Password */}
							<View>
								<Text className="text-white/60 text-sm mb-2 ml-1">
									Password
								</Text>
								<TextInput
									value={password}
									onChangeText={setPassword}
									placeholder="••••••••"
									placeholderTextColor="rgba(255,255,255,0.2)"
									secureTextEntry
									autoComplete="password"
									returnKeyType="done"
									onSubmitEditing={handleLogin}
									className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-base"
								/>
							</View>

							{/* Submit */}
							<TouchableOpacity
								onPress={handleLogin}
								disabled={isLoading}
								activeOpacity={0.8}
								className="bg-primary rounded-xl py-4 items-center mt-2"
								style={{ opacity: isLoading ? 0.7 : 1 }}>
								{isLoading ? (
									<ActivityIndicator color="white" />
								) : (
									<Text className="text-white text-base font-medium">
										Sign in
									</Text>
								)}
							</TouchableOpacity>
						</View>

						{/* Footer */}
						<Text className="text-white/30 text-sm text-center">
							Don't have an account?{" "}
							<Text className="text-primary">Sign up on the web app first</Text>
						</Text>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}
