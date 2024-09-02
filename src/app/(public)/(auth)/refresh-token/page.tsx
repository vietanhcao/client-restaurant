"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import {
	checkAndRefreshToken,
	getRefreshTokenFromLocalStorage,
} from "../../../../lib/utils";
import { useAppConext } from "../../../../components/app-provider";

function RefreshToken() {
	const searchParams = useSearchParams();
	const refreshToken = searchParams.get("refreshToken");
	const redirectPath = searchParams.get("redirect");
	const router = useRouter();
	const ref = useRef<any>(null);
	const { disconnectSocket } = useAppConext();
	useEffect(() => {
		if (ref.current) {
			return;
		}
		if (refreshToken !== getRefreshTokenFromLocalStorage()) {
			router.push("/login");
			disconnectSocket()
			return;
		}
		ref.current = checkAndRefreshToken;
		checkAndRefreshToken({
			onSuccess: () => {
				ref.current = null;
				router.push(redirectPath ?? "/");
			},
			onError: () => {
				// trường hợp 404
				ref.current = null;
				disconnectSocket()
				router.push("/login");
			},
		});
	}, [redirectPath, refreshToken, router, disconnectSocket]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			Refresh token...
		</div>
	);
}

export default function RefreshTokenPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<RefreshToken />
		</Suspense>
	);
}
