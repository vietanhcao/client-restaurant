"use client";

import { Suspense, useEffect, useRef } from "react";
import { useLogoutMutation } from "../../../../../queries/useAuth";
import { useRouter } from "@/i18n/routing";
import {
	getAccessTokenFromLocalStorage,
	getRefreshTokenFromLocalStorage,
} from "../../../../../lib/utils";
import useAppStore from "@/store/useAppStore";
import { useSearchParams } from "next/navigation";

function Logout() {
	const { mutateAsync } = useLogoutMutation();
	const { setRole, disconnectSocket } = useAppStore();
	const searchParams = useSearchParams();
	const refreshToken = searchParams.get("refreshToken");
	const accessToken = searchParams.get("accessToken");
	const router = useRouter();
	const ref = useRef<any>(null);
	useEffect(() => {
		// trick to prevent twice logout request and check exact refresh token
		if (ref.current) {
			return;
		}
		if (
			ref.current ||
			refreshToken !== getRefreshTokenFromLocalStorage() ||
			accessToken !== getAccessTokenFromLocalStorage()
		) {
			router.push("/login");
			return;
		}
		ref.current = mutateAsync;

		mutateAsync().then((res) => {
			setTimeout(() => {
				ref.current = null;
			}, 1000);
			setRole(undefined);
			disconnectSocket();
			router.push("/login");
		});
	}, [
		accessToken,
		mutateAsync,
		refreshToken,
		router,
		setRole,
		disconnectSocket,
	]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			LogoutPage
		</div>
	);
}

export default function LogoutPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Logout />
		</Suspense>
	);
}
