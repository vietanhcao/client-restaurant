"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { checkAndRefreshToken } from "../lib/utils";

const UNAUTHENTICATED_PATHS = [
	"/login",
	"/register",
	"/logout",
	"/refresh-token",
];
export default function RefreshToken() {
	const pathname = usePathname();

	useEffect(() => {
		if (UNAUTHENTICATED_PATHS.includes(pathname)) return;
		let intervalId: NodeJS.Timeout;
		// phải gọi lần đầu tiên, vì interval sẽ chạy sau khoảng thời gian TIMEOUT
		checkAndRefreshToken({
			onError: () => {
				clearInterval(intervalId);
			},
		});
		// Timeout interval phải bé hơn thời gian hết hạn của access token

		const TIMEOUT = 1000;
		intervalId = setInterval(checkAndRefreshToken, TIMEOUT);

		return () => clearInterval(intervalId);
	}, [pathname]);
	return null;
}
