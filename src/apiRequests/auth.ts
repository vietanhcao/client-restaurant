import http from "../lib/http";
import {
	LoginBodyType,
	LoginResType,
	LogoutBodyType,
	RefreshTokenBodyType,
	RefreshTokenResType,
} from "../schemaValidations/auth.schema";

const authApiRequest = {
	refreshTokenRequest: null as Promise<{
		status: number;
		payload: RefreshTokenResType;
	}> | null,

	sLogin: async (body: LoginBodyType) =>
		http.post<LoginResType>("/auth/login", body),

	login: (body: LoginBodyType) =>
		http.post<LoginResType>("/api/auth/login", body, {
			baseUrl: "",
		}),
	sLogout: async (
		body: LogoutBodyType & {
			accessToken: string;
		}
	) =>
		http.post(
			"/auth/logout",
			{ refreshToken: body.refreshToken },
			{
				headers: {
					Authorization: `Bearer ${body.accessToken}`,
				},
			}
		),
	logout: () =>
		http.post("/api/auth/logout", null, {
			baseUrl: "",
		}),
	sRefreshToken: async (body: RefreshTokenBodyType) =>
		http.post<RefreshTokenResType>("/auth/refresh-token", body),

	async refreshToken() {
		// tranhs trường hợp gọi nhiều lần
		if (this.refreshTokenRequest) {
			return this.refreshTokenRequest;
		}

		const res = await http.post<RefreshTokenResType>(
			"/api/auth/refresh-token",
			null,
			{
				baseUrl: "",
			}
		);
		this.refreshTokenRequest = null;
		return res;
	},
};

export default authApiRequest;
