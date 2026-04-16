import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { apiFetch } from "@/lib/api";

const TOKEN_KEY = "fittrack_jwt";

interface User {
	id: string;
	email: string;
	name: string;
}

interface AuthContextValue {
	user: User | null;
	token: string | null;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Rehydrate token on app launch
	useEffect(() => {
		SecureStore.getItemAsync(TOKEN_KEY).then((stored) => {
			if (stored) {
				// Token exists — decode user from it (no extra network call)
				try {
					const payload = JSON.parse(atob(stored.split(".")[1]));
					setToken(stored);
					setUser({
						id: payload.sub,
						email: payload.email,
						name: payload.name,
					});
				} catch {
					SecureStore.deleteItemAsync(TOKEN_KEY);
				}
			}
			setIsLoading(false);
		});
	}, []);

	async function login(email: string, password: string) {
		const data = await apiFetch<{ token: string; user: User }>(
			"/api/auth/login",
			{
				method: "POST",
				body: JSON.stringify({ email, password }),
			},
		);
		await SecureStore.setItemAsync(TOKEN_KEY, data.token);
		setToken(data.token);
		setUser(data.user);
	}

	async function logout() {
		await SecureStore.deleteItemAsync(TOKEN_KEY);
		setToken(null);
		setUser(null);
	}

	return (
		<AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
}
