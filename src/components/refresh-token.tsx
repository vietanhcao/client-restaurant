"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
	getAccessTokenFromLocalStorage,
	getRefreshTokenFromLocalStorage,
	setAccessTokenFromLocalStorage,
	setRefreshTokenFromLocalStorage,
} from "../lib/utils";
import jwt from "jsonwebtoken";
import authApiRequest from "../apiRequests/auth";

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
		const checkAndRefreshToken = async () => {
			const accessToken = getAccessTokenFromLocalStorage();
			const refreshToken = getRefreshTokenFromLocalStorage();
			if (!accessToken || !refreshToken) return;
			const decodedAccessToken = jwt.decode(accessToken) as {
				exp: number;
				iat: number;
			};
			const decodedRefreshToken = jwt.decode(refreshToken) as {
				exp: number;
				iat: number;
			};
			// Thời điểm hết hạn của token là tính theo epoch time
			// new Date().getTime() epoch time (ms)
			const now = Math.round(new Date().getTime() / 1000);
			// Trường hợp refresh token hết hạn không xử lý
			if (decodedRefreshToken.exp < now) return;
			// Còn 1/3 thời gian hết hạn của access token thì refresh token
			// thời gian còn lại công thức: decodedAccessToken.exp - now
			// thời gian hết hạn của access token: decodedAccessToken.exp - decodedAccessToken.iat

			if (
				decodedAccessToken.exp - now >
				(decodedAccessToken.exp - decodedAccessToken.iat) / 3
			) {
				return;
			}

			try {
				const res = await authApiRequest.refreshToken();
				setAccessTokenFromLocalStorage(res.payload.data.accessToken);
				setRefreshTokenFromLocalStorage(res.payload.data.refreshToken);
			} catch (error) {
				clearInterval(intervalId);
			}
		};
		// phải gọi lần đầu tiên, vì interval sẽ chạy sau khoảng thời gian TIMEOUT
		checkAndRefreshToken();
		// Timeout interval phải bé hơn thời gian hết hạn của access token

		const TIMEOUT = 1000;
		intervalId = setInterval(checkAndRefreshToken, TIMEOUT);

		return () => clearInterval(intervalId);
	}, [pathname]);
	return null;
}
