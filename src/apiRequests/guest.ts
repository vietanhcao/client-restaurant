import http from "../lib/http";
import { LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from "../schemaValidations/auth.schema";
import { GuestLoginBodyType, GuestLoginResType } from "../schemaValidations/guest.schema";

const guestApiRequest = {
	refreshTokenRequest: null as Promise<{
		status: number;
		payload: RefreshTokenResType;
	}> | null,

	sLogin: async (body: GuestLoginBodyType) =>
		http.post<GuestLoginResType>("/guest/auth/login", body),

	login: (body: GuestLoginBodyType) =>
		http.post<GuestLoginResType>("/api/guest/auth/login", body, {
			baseUrl: "",
		}),
	sLogout: async (
		body: LogoutBodyType & {
			accessToken: string;
		}
	) =>
		http.post(
			"/guest/auth/logout",
			{ refreshToken: body.refreshToken },
			{
				headers: {
					Authorization: `Bearer ${body.accessToken}`,
				},
			}
		),
	logout: () =>
		http.post("/api/guest/auth/logout", null, {
			baseUrl: "",
		}),
	sRefreshToken: async (body: RefreshTokenBodyType) =>
		http.post<RefreshTokenResType>("/guest/auth/refresh-token", body),

	async refreshToken() {
		// tranhs trường hợp gọi nhiều lần
		if (this.refreshTokenRequest) {
			return this.refreshTokenRequest;
		}

		const res = await http.post<RefreshTokenResType>(
			"/api/guest/auth/refresh-token",
			null,
			{
				baseUrl: "",
			}
		);
		this.refreshTokenRequest = null;
		return res;
	},
};

export default guestApiRequest;
