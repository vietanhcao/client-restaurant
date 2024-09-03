"use client";
import useAppStore from "@/store/useAppStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useRef } from "react";
import {
	decodeToken,
	generateSocketInstance,
	getAccessTokenFromLocalStorage,
} from "../lib/utils";
import RefreshToken from "./refresh-token";

// stale time: default 0
// gc: garbage collection time: default 5 minutes
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
	const { setRole, setSocket } = useAppStore();
	const countRef = useRef(0);

	useEffect(() => {
		if (countRef.current > 0) {
			return;
		}
		const accessToken = getAccessTokenFromLocalStorage();
		if (accessToken) {
			const { role } = decodeToken(accessToken);
			setRole(role);
			setSocket(generateSocketInstance(accessToken));
		}
		countRef.current++;
	}, [setRole, setSocket]);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<RefreshToken />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
