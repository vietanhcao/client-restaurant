"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import RefreshToken from "./refresh-token";
import {
	decodeToken,
	generateSocketInstance,
	getAccessTokenFromLocalStorage,
	removeTokensFromLocalStorage,
} from "../lib/utils";
import { RoleType } from "../types/jwt.types";
import { Socket } from "socket.io-client";

// stale time: default 0
// gc: garbage collection time: default 5 minutes

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

const AppContext = createContext({
	isAuth: false,
	role: undefined as RoleType | undefined,
	setRole: (role?: RoleType | undefined) => {},
	socket: undefined as Socket | undefined,
	setSocket: (socket?: Socket | undefined) => {},
	disconnectSocket: () => {},
});

export const useAppConext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error("useAppContext must be used within a AppProvider");
	}
	return context;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
	const [role, setRoleState] = useState<RoleType | undefined>();
	const [socket, setSocket] = useState<Socket | undefined>();
	const countRef = useRef(0);

	useEffect(() => {
		if (countRef.current > 0) {
			return;
		}
		const accessToken = getAccessTokenFromLocalStorage();
		if (accessToken) {
			const { role } = decodeToken(accessToken);
			setRoleState(role);
			setSocket(generateSocketInstance(accessToken));
		}
		countRef.current++;
	}, []);

	const disconnectSocket = useCallback(() => {
		socket?.disconnect();
		setSocket(undefined);
	}, [socket]);

	const setRole = useCallback((role?: RoleType) => {
		setRoleState(role);
		if (!role) {
			removeTokensFromLocalStorage();
		}
	}, []);

	const isAuth = !!role;

	return (
		<AppContext.Provider
			value={{ role, setRole, isAuth, socket, setSocket, disconnectSocket }}
		>
			<QueryClientProvider client={queryClient}>
				{children}
				<RefreshToken />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</AppContext.Provider>
	);
}
