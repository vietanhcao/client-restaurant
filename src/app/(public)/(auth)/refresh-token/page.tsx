"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import {
	checkAndRefreshToken,
	getRefreshTokenFromLocalStorage,
} from "../../../../lib/utils";

export default function RefreshTokenPage() {
	const searchParams = useSearchParams();
	const refreshToken = searchParams.get("refreshToken");
	const redirectPath = searchParams.get("redirect");
	const router = useRouter();
	const ref = useRef<any>(null);
	useEffect(() => {
		if (ref.current) {
			return;
		}
		if (refreshToken !== getRefreshTokenFromLocalStorage()) {
			router.push("/login");
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
        router.push("/login");
      },
		});
	}, [redirectPath, refreshToken, router]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			Refresh token...
		</div>
	);
}
