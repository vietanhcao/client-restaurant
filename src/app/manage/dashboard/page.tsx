import { cookies } from "next/headers";
import React from "react";
import accountApiRequest from "../../../apiRequests/account";

export default async function pageDashboard() {
	const cookieStore = cookies();
	const accessToken = cookieStore.get("accessToken")?.value!;
	let res;
	try {
		res = await accountApiRequest.sMe(accessToken);
	} catch (error: any) {
    // dùng redirect phải throw error 
		if (error.digest?.includes("NEXT_REDIRECT")) {
			throw new Error("NEXT_REDIRECT");
		}
	}
	if (!res) {
		return <div>pageDashboard</div>;
	}
	return <div>pageDashboard {res.payload.data.email}</div>;
}
