"use client";

import { Suspense, useEffect, useRef } from "react";
import { useLogoutMutation } from "../../../../queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import {
	getAccessTokenFromLocalStorage,
	getRefreshTokenFromLocalStorage,
} from "../../../../lib/utils";
import { useAppConext } from "../../../../components/app-provider";

function Logout() {
	const { mutateAsync } = useLogoutMutation();
	const { setIsAuth } = useAppConext();
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
			setIsAuth(false);
			router.push("/login");
		});
	}, [accessToken, mutateAsync, refreshToken, router, setIsAuth]);

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
