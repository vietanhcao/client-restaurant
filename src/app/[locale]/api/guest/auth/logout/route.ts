import { cookies } from "next/headers";
import guestApiRequest from "../../../../../../apiRequests/guest";

export async function POST(request: Request) {
	const cookieStore = cookies();
	const accessToken = cookieStore.get("accessToken")?.value ?? "";
	const refreshToken = cookieStore.get("refreshToken")?.value ?? "";

	cookieStore.delete("accessToken");
	cookieStore.delete("refreshToken");

	if (accessToken === "" || refreshToken === "") {
		return Response.json({ message: "Credentials not found" }, { status: 200 });
	}

	try {
		const { payload } = await guestApiRequest.sLogout({
			refreshToken,
			accessToken,
		});

		return Response.json(payload);
	} catch (error) {
		return Response.json({ message: "Internal Server Error" }, { status: 200 });
	}
}
