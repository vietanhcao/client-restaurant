"use client";

import { useEffect, useRef } from "react";
import { useLogoutMutation } from "../../../../queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { getRefreshTokenFromLocalStorage } from "../../../../lib/utils";

export default function LogoutPage() {
	const { mutateAsync } = useLogoutMutation();
	const searchParams = useSearchParams();
	const refreshToken = searchParams.get("refreshToken");
	const router = useRouter();
	const ref = useRef<any>(null);
	useEffect(() => {
		// trick to prevent twice logout request and check exact refresh token
		if (ref.current || refreshToken !== getRefreshTokenFromLocalStorage())
			return;
		ref.current = mutateAsync;

		mutateAsync().then((res) => {
			setTimeout(() => {
				ref.current = null;
			}, 1000);
			router.push("/login");
		});
	}, [mutateAsync, refreshToken, router]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			LogoutPage
		</div>
	);
}
