import { type ClassValue, clsx } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "../components/ui/use-toast";
import jwt from "jsonwebtoken";
import authApiRequest from "../apiRequests/auth";
import envConfig from "../config";
import { DishStatus, OrderStatus, Role, TableStatus } from "../constants/type";
import { TokenPayload } from "../types/jwt.types";
import guestApiRequest from "../apiRequests/guest";

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

export const removeTokensFromLocalStorage = () => {
	isBrowser && localStorage.removeItem("accessToken");
	isBrowser && localStorage.removeItem("refreshToken");
};

export const checkAndRefreshToken = async (param?: {
	onError?: () => void;
	onSuccess?: () => void;
}) => {
	const accessToken = getAccessTokenFromLocalStorage();
	const refreshToken = getRefreshTokenFromLocalStorage();
	if (!accessToken || !refreshToken) return;
	const decodedAccessToken = decodeToken(accessToken);
	const decodedRefreshToken = decodeToken(refreshToken);
	// Thời điểm hết hạn của token là tính theo epoch time
	// new Date().getTime() epoch time (ms)
	// trường hợp bị lệch so với khi set cookie
	const now = new Date().getTime() / 1000 - 1;
	// Trường hợp refresh token hết hạn  xử lý logout xóa token
	if (decodedRefreshToken.exp < now) {
		removeTokensFromLocalStorage();
		param?.onError && param.onError();
		return;
	}
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
		const role = decodedRefreshToken.role;
		const res =
			role === Role.Guest
				? await guestApiRequest.refreshToken()
				: await authApiRequest.refreshToken();
		setAccessTokenFromLocalStorage(res.payload.data.accessToken);
		setRefreshTokenFromLocalStorage(res.payload.data.refreshToken);
		param?.onSuccess && param.onSuccess();
	} catch (error) {
		param?.onError && param.onError();
	}
};

export const formatCurrency = (number: number) => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(number);
};

export const getVietnameseDishStatus = (
	status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
	switch (status) {
		case DishStatus.Available:
			return "Có sẵn";
		case DishStatus.Unavailable:
			return "Không có sẵn";
		default:
			return "Ẩn";
	}
};

export const getVietnameseOrderStatus = (
	status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
	switch (status) {
		case OrderStatus.Delivered:
			return "Đã phục vụ";
		case OrderStatus.Paid:
			return "Đã thanh toán";
		case OrderStatus.Pending:
			return "Chờ xử lý";
		case OrderStatus.Processing:
			return "Đang nấu";
		default:
			return "Từ chối";
	}
};

export const getVietnameseTableStatus = (
	status: (typeof TableStatus)[keyof typeof TableStatus]
) => {
	switch (status) {
		case TableStatus.Available:
			return "Có sẵn";
		case TableStatus.Reserved:
			return "Đã đặt";
		default:
			return "Ẩn";
	}
};

export const getTableLink = ({
	token,
	tableNumber,
}: {
	token: string;
	tableNumber: number;
}) => {
	return (
		envConfig.NEXT_PUBLIC_URL + "/tables/" + tableNumber + "?token=" + token
	);
};

export const decodeToken = (token: string) => {
	return jwt.decode(token) as TokenPayload;
};

export function removeAccents(str: string) {
	return str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ/g, "d")
		.replace(/Đ/g, "D");
}

export const simpleMatchText = (fullText: string, matchText: string) => {
	return removeAccents(fullText.toLowerCase()).includes(
		removeAccents(matchText.trim().toLowerCase())
	);
};

// export const formatDateTimeToLocaleString = (date: string | Date) => {
// 	return format(
// 		date instanceof Date ? date : new Date(date),
// 		"HH:mm:ss dd/MM/yyyy"
// 	);
// };

// export const formatDateTimeToTimeString = (date: string | Date) => {
// 	return format(date instanceof Date ? date : new Date(date), "HH:mm:ss");
// };

// export const OrderStatusIcon = {
// 	[OrderStatus.Pending]: Loader,
// 	[OrderStatus.Processing]: CookingPot,
// 	[OrderStatus.Rejected]: BookX,
// 	[OrderStatus.Delivered]: Truck,
// 	[OrderStatus.Paid]: HandCoins,
// };
