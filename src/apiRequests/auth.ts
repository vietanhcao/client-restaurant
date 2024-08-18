import http from "../lib/http";
import {
	LoginBodyType,
	LoginResType,
	LogoutBodyType,
} from "../schemaValidations/auth.schema";

const authApiRequest = {
	sLogin: async (body: LoginBodyType) =>
		http.post<LoginResType>("/auth/login", body),

	login: (body: LoginBodyType) =>
		http.post<LoginResType>("api/auth/login", body, {
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
		http.post(
			"api/auth/logout",
			{},
			{
				baseUrl: "",
			}
		),
};

export default authApiRequest;
