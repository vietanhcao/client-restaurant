import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import authApiRequest from "../../../../apiRequests/auth";
import { HttpError } from "../../../../lib/http";

export async function POST(request: Request) {
	const cookieStore = cookies();
	const refreshToken = cookieStore.get("refreshToken")?.value;
	if (!refreshToken) {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const { payload } = await authApiRequest.sRefreshToken({
			refreshToken,
		});

		const decodedAccessToken = jwt.decode(payload.data.accessToken) as {
			exp: number;
		};
		const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as {
			exp: number;
		};

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
