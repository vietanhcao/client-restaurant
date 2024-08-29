import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeToken } from "./lib/utils";
import { Role } from "./constants/type";

const managePaths = ["/manage"];
const guestPaths = ["/guest"];
const privatePaths = [...managePaths, ...guestPaths];
const unAuthPaths = ["/login", "/logout"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get("accessToken")?.value;
	const refreshToken = request.cookies.get("refreshToken")?.value;

	// If the user is not authenticated
	if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
		const url = new URL("/login", request.url);
		url.searchParams.set("clearTokens", "true");
		return NextResponse.redirect(url);
	}

	// If the user is authenticated
	if (refreshToken) {
		// If the user tries to access a public page
		if (unAuthPaths.some((path) => pathname.startsWith(path))) {
			return NextResponse.redirect(new URL("/", request.url));
		}

		//  If the user has accessToken expried and tries to access a private page
		if (
			privatePaths.some((path) => pathname.startsWith(path)) &&
			!accessToken
		) {
			const url = new URL("/refresh-token", request.url);
			url.searchParams.set("refreshToken", refreshToken ?? "");
			url.searchParams.set("redirect", pathname);

			return NextResponse.redirect(url);
		}

		// If the user incorrect role
		const role = decodeToken(refreshToken).role;
		// guest can't access manage page
		const isGuestGoToManage =
			role === Role.Guest &&
			managePaths.some((path) => pathname.startsWith(path));
		// not guest try to access guest page
		const isNotGuestGoToGuest =
			role !== Role.Guest &&
			guestPaths.some((path) => pathname.startsWith(path));

		if (isGuestGoToManage || isNotGuestGoToGuest) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ["/manage/:path*", "/logout", "/login", "/guest/:path*"],
};
