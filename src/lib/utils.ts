import { type ClassValue, clsx } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "../components/ui/use-toast";
import jwt from "jsonwebtoken";
import authApiRequest from "../apiRequests/auth";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const handleErrorApi = ({
	error,
	setError,
	duration = 5000,
}: {
	error: any;
	setError?: UseFormSetError<any>;
	duration?: number;
}) => {
	if (error instanceof EntityError && setError) {
		error.payload.errors.forEach(({ field, message }) => {
			setError(field, { message, type: "server" });
		});
	} else {
		toast({
			title: "Error",
			description: error?.payload?.message ?? "Something went wrong",
			variant: "destructive",
			duration,
		});
		console.error(error);
	}
};

/**
 * xóa dấu / ở đầu path
 * @param path
 * @returns
 */
export const normalizePath = (path: string) => {
	return path.startsWith("/") ? path.slice(1) : path;
};

export const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () => {
	return isBrowser ? localStorage.getItem("accessToken") : null;
};

export const setAccessTokenFromLocalStorage = (accessToken: string) => {
	isBrowser && localStorage.setItem("accessToken", accessToken);
};

export const getRefreshTokenFromLocalStorage = () => {
	return isBrowser ? localStorage.getItem("refreshToken") : null;
};

export const setRefreshTokenFromLocalStorage = (refreshToken: string) => {
	isBrowser && localStorage.setItem("refreshToken", refreshToken);
};

export const checkAndRefreshToken = async (param?: {
	onError?: () => void;
	onSuccess?: () => void;
}) => {
	const accessToken = getAccessTokenFromLocalStorage();
	const refreshToken = getRefreshTokenFromLocalStorage();
	if (!accessToken || !refreshToken) return;
	const decodedAccessToken = jwt.decode(accessToken) as {
		exp: number;
		iat: number;
	};
	const decodedRefreshToken = jwt.decode(refreshToken) as {
		exp: number;
		iat: number;
	};
	// Thời điểm hết hạn của token là tính theo epoch time
	// new Date().getTime() epoch time (ms)
	const now = Math.round(new Date().getTime() / 1000);
	// Trường hợp refresh token hết hạn không xử lý
	if (decodedRefreshToken.exp < now) return;
	// Còn 1/3 thời gian hết hạn của access token thì refresh token
	// thời gian còn lại công thức: decodedAccessToken.exp - now
	// thời gian hết hạn của access token: decodedAccessToken.exp - decodedAccessToken.iat

	if (
		decodedAccessToken.exp - now >
		(decodedAccessToken.exp - decodedAccessToken.iat) / 3
	) {
		return;
	}

	try {
		const res = await authApiRequest.refreshToken();
		setAccessTokenFromLocalStorage(res.payload.data.accessToken);
		setRefreshTokenFromLocalStorage(res.payload.data.refreshToken);
		param?.onSuccess && param.onSuccess();
	} catch (error) {
		param?.onError && param.onError();
	}
};
