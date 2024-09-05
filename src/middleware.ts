import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "./constants/type";
import jwt from "jsonwebtoken";
import { TokenPayload } from "./types/jwt.types";
import createMiddleware from "next-intl/middleware";
import { locales } from "./config";

const managePaths = ["/vi/manage", "/en/manage"];
const guestPaths = ["/vi/guest", "/en/guest"];
const onlyOwnerPaths = ["/vi/manage/accounts", "/en/manage/accounts"];
const privatePaths = [...managePaths, ...guestPaths];
const unAuthPaths = ["/vi/login", "/en/login", "/vi/logout", "/en/logout"];

// just use for middleware
const decodeToken = (token: string) => {
	return jwt.decode(token) as TokenPayload;
};

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const handleI18nRouting = createMiddleware({
		// A list of all locales that are supported
		locales: locales,

		// Used when no locale matches
		defaultLocale: locales[1],
	});
	const response = handleI18nRouting(request);

	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get("accessToken")?.value;
	const refreshToken = request.cookies.get("refreshToken")?.value;

	// If the user is not authenticated
	if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
		const url = new URL("/login", request.url);
		url.searchParams.set("clearTokens", "true");
		response.headers.set("x-middleware-rewrite", url.toString());
		return response;
	}

	// If the user is authenticated
	if (refreshToken) {
		// If the user tries to access a public page
		if (unAuthPaths.some((path) => pathname.startsWith(path))) {
			response.headers.set(
				"x-middleware-rewrite",
				new URL("/", request.url).toString()
			);
			return response;
		}

		//  If the user has accessToken expried and tries to access a private page
		if (
			privatePaths.some((path) => pathname.startsWith(path)) &&
			!accessToken
		) {
			const url = new URL("/refresh-token", request.url);
			url.searchParams.set("refreshToken", refreshToken ?? "");
			url.searchParams.set("redirect", pathname);

			response.headers.set("x-middleware-rewrite", url.toString());
			return response;
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

		const isNotOwnerGoToOwner =
			role !== Role.Owner &&
			onlyOwnerPaths.some((path) => pathname.startsWith(path));

		if (isGuestGoToManage || isNotGuestGoToGuest || isNotOwnerGoToOwner) {
			// return NextResponse.redirect(new URL("/", request.url));
			response.headers.set(
				"x-middleware-rewrite",
				new URL("/", request.url).toString()
			);
			return response;
		}
	}

	return response;
}

// See "Matching Paths" below to learn more
export const config = {
	// matcher: ["/manage/:path*", "/logout", "/login", "/guest/:path*"],
	matcher: ["/", "/(vi|en)/:path*"],
};
