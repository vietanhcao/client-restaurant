import { create } from "zustand";

import { logger } from "./logger";
import { RoleType } from "../types/jwt.types";
import { Socket } from "socket.io-client";
import { removeTokensFromLocalStorage } from "../lib/utils";

type AppStoreType = {
	isAuth: boolean;
	role: RoleType | undefined;
	setRole: (role?: RoleType | undefined) => void;
	socket: Socket | undefined;
	setSocket: (socket?: Socket | undefined) => void;
	disconnectSocket: () => void;
};

export const useAppStore = create<AppStoreType>()(
	logger<AppStoreType>(
		(set) => ({
			isAuth: false,
			role: undefined as RoleType | undefined,
			setRole: (role?: RoleType | undefined) =>
				set((state) => {
					if (!role) {
						removeTokensFromLocalStorage();
					}

					return { role, isAuth: !!role };
				}),
			socket: undefined as Socket | undefined,
			setSocket: (socket?: Socket | undefined) => set({ socket }),
			disconnectSocket: () =>
				set((state) => {
					state.socket?.disconnect();
					return { socket: undefined };
				}),
		}),
		"appStore"
	)
);

export default useAppStore;
