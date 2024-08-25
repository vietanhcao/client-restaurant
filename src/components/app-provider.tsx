"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import RefreshToken from "./refresh-token";
import {
	getAccessTokenFromLocalStorage,
	removeTokensFromLocalStorage,
} from "../lib/utils";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		},
	},
});

const AppContext = createContext({
	isAuth: false,
	setIsAuth: (isAuth: boolean) => {},
});

export const useAppConext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within a AppProvider");
	}
	return context;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
	const [isAuth, setIsAuthState] = useState(false);

	useEffect(() => {
		const accessToken = getAccessTokenFromLocalStorage();
		if (accessToken) {
			setIsAuthState(true);
		}
	}, []);

	const setIsAuth = useCallback((isAuth: boolean) => {
		if (!isAuth) {
			removeTokensFromLocalStorage();
		}
		setIsAuthState(isAuth);
	}, []);

	return (
		<AppContext.Provider value={{ isAuth, setIsAuth }}>
			<QueryClientProvider client={queryClient}>
				{children}
				<RefreshToken />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</AppContext.Provider>
	);
}
