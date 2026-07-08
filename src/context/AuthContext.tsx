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
	login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
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
			if (!stored) {
				setIsLoading(false);
				return;
			}

			// Try decoding JWT locally first
			let decoded = false;
			try {
				const parts = stored.split(".");
				if (parts.length === 3) {
					const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
					const payload = JSON.parse(atob(base64));
					if (payload.sub && payload.email) {
						setToken(stored);
						setUser({
							id: payload.sub,
							email: payload.email,
							name: payload.name || "",
						});
						decoded = true;
					}
				}
			} catch {
				// Fall through to API check
			}

			if (decoded) {
				setIsLoading(false);
			} else {
				// Local decode failed — verify token via API
				apiFetch<{ user: User }>("/api/auth/me", { token: stored })
					.then((data) => {
						setToken(stored);
						setUser(data.user);
					})
					.catch(() => {
						SecureStore.deleteItemAsync(TOKEN_KEY);
					})
					.finally(() => setIsLoading(false));
			}
		});
	}, []);

	async function login(email: string, password: string, rememberMe = true) {
		const data = await apiFetch<{ token: string; user: User }>(
			"/api/auth/login",
			{
				method: "POST",
				body: JSON.stringify({ email, password }),
			},
		);
		setToken(data.token);
		setUser(data.user);
		if (rememberMe) {
			await SecureStore.setItemAsync(TOKEN_KEY, data.token);
		} else {
			await SecureStore.deleteItemAsync(TOKEN_KEY);
		}
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
