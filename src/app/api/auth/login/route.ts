import { cookies } from "next/headers";
import { LoginBodyType } from "../../../../schemaValidations/auth.schema";
import authApiRequest from "../../../../apiRequests/auth";
import jwt from "jsonwebtoken";
import { HttpError } from "../../../../lib/http";
import { decodeToken } from "../../../../lib/utils";

export async function POST(request: Request) {
	const body = (await request.json()) as LoginBodyType;
	const cookieStore = cookies();
	try {
		const { payload } = await authApiRequest.sLogin(body);
		const { accessToken, refreshToken } = payload.data;

		const decodedAccessToken = decodeToken(accessToken)
		const decodedRefreshToken = decodeToken(refreshToken)

		cookieStore.set("accessToken", accessToken, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			expires: decodedAccessToken.exp * 1000,
		});

		cookieStore.set("refreshToken", refreshToken, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			expires: decodedRefreshToken.exp * 1000,
		});

		return Response.json(payload);
	} catch (error) {
		console.log("🚀 ~ POST ~ error:", error)
		if (error instanceof HttpError) {
			return Response.json(error.payload, { status: error.status });
		} else {
			return Response.json(
				{ message: "Internal Server Error" },
				{ status: 500 }
			);
		}
	}
}
