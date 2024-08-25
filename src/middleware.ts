import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/logout"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get("accessToken")?.value;
	const refreshToken = request.cookies.get("refreshToken")?.value;

	// Not authenticated and trying to access a private page, redirect them to the login page
	if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// If the user is authenticated and tries to access a public page, redirect them to the dashboard
	if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	//  If the user has accessToken expried and tries to access a private page, redirect them to the logout page
	if (
		privatePaths.some((path) => pathname.startsWith(path)) &&
		!accessToken &&
		refreshToken
	) {
		const url = new URL("/refresh-token", request.url);
		url.searchParams.set("refreshToken", refreshToken ?? "");
		url.searchParams.set("redirect", pathname);

		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ["/manage/:path*", "/logout"],
};
