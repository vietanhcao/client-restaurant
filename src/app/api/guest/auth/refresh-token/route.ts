import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import guestApiRequest from "../../../../../apiRequests/guest";
import { HttpError } from "../../../../../lib/http";
import { decodeToken } from "../../../../../lib/utils";

export async function POST(request: Request) {
	const cookieStore = cookies();
	const refreshToken = cookieStore.get("refreshToken")?.value;
	if (!refreshToken) {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const { payload } = await guestApiRequest.sRefreshToken({
			refreshToken,
		});

		const decodedAccessToken = decodeToken(payload.data.accessToken)
		const decodedRefreshToken = decodeToken(payload.data.refreshToken)

		cookieStore.set("accessToken", payload.data.accessToken, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			expires: decodedAccessToken.exp * 1000,
		});

		cookieStore.set("refreshToken", payload.data.refreshToken, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			expires: decodedRefreshToken.exp * 1000,
		});

		return Response.json(payload);
	} catch (error: any) {
		console.log("🚀 ~ POST ~ error:", error);
		if (error instanceof HttpError) {
			return Response.json(error.payload, { status: error.status });
		} else {
			return Response.json(
				{ message: error.message ?? "Unauthorized" },
				{ status: 401 }
			);
		}
	}
}
