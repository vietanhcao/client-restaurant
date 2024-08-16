import { redirect } from "next/navigation";
import { LoginResType } from "../schemaValidations/auth.schema";
import { normalizePath } from "./utils";
import envConfig from "../config";

type CustomOptions = Omit<RequestInit, "method"> & {
	baseUrl?: string;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPlayload = {
	message: string;
	errors: { field: string; message: string }[]; // format server trả về
};

export class HttpError extends Error {
	status: number;
	payload: {
		message: string;
		[key: string]: any;
	};
	constructor({
		status,
		payload,
		message = "HTTP Error",
	}: {
		status: number;
		payload: any;
		message?: string;
	}) {
		super(message);
		this.status = status;
		this.payload = payload;
	}
}

export class EntityError extends HttpError {
	status: typeof ENTITY_ERROR_STATUS;
	payload: EntityErrorPlayload;
	constructor({
		status,
		payload,
	}: {
		status: typeof ENTITY_ERROR_STATUS;
		payload: EntityErrorPlayload;
	}) {
		super({ status, payload, message: "Entity Error" });
		if (status !== ENTITY_ERROR_STATUS) {
			throw new Error("EntityError must have status 422");
		}
		this.status = status;
		this.payload = payload;
	}
}

let clientLogoutRequest: Promise<Response> | null = null;

// nên dùng hàm vì mỗi lần khởi tạo request isClient sẽ có giá trị mới
export const isClient = typeof window !== "undefined";

const request = async <Response>(
	method: "GET" | "POST" | "PUT" | "DELETE",
	url: string,
	options?: CustomOptions
) => {
	let body: string | FormData | undefined = undefined;
	if (options?.body instanceof FormData) {
		body = options.body;
	} else if (options?.body) {
		body = JSON.stringify(options.body);
	}

	const baseHeader: {
		[key: string]: string;
	} = body instanceof FormData ? {} : { "Content-Type": "application/json" };

	if (isClient) {
		const accsessToken = localStorage.getItem("accsessToken");
		if (accsessToken) {
			baseHeader.Authorization = `Bearer ${accsessToken}`;
		}
	}

	// Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào ""  thì đồng nghĩa với việc gọi đến Api Nextjs

	const baseUrl =
		options?.baseUrl === undefined
			? envConfig.NEXT_PUBLIC_API_URL
			: options.baseUrl;

	const fullUrl = `${baseUrl}/${normalizePath(url)}`;

	const res = await fetch(fullUrl, {
		...options,
		method,
		headers: {
			...baseHeader,
			...options?.headers,
		},
		body,
	});

	const payload: Response = await res.json();

	const data = {
		status: res.status,
		payload,
	};

	// Interceptor xử lý lỗi
	if (!res.ok) {
		if (res.status === ENTITY_ERROR_STATUS) {
			throw new EntityError(
				data as {
					status: typeof ENTITY_ERROR_STATUS;
					payload: EntityErrorPlayload;
				}
			);
		}
		if (res.status === AUTHENTICATION_ERROR_STATUS) {
			if (isClient) {
				// client side
				// chặn việc gọi nhiều lần logout
				if (!clientLogoutRequest) {
					// Xóa token khi logout ở client chỉ sử dụng function base ở interceptor
					// lúc này sẽ không còn clientaccsessToken.value
					// call api logout server nextjs to remove cookie
					clientLogoutRequest = fetch("/api/auth/logout", {
						method: "POST",
						headers: {
							...baseHeader,
						},
						body: null, // cho phép luôn luôn thành công
					});

					try {
						await clientLogoutRequest;
					} catch (error) {
					} finally {
						localStorage.removeItem("accsessToken");
						localStorage.removeItem("refreshToken");
						clientLogoutRequest = null;
						// Redirect về trang login có thể dẫn đến loop vô hạn
						// Nếu không xử lý đúng cách
						// vì nếu rơi vào TH trang login, chúng ta có gọi các API cần accsessToken
						// mà accsessToken đã bị xóa nó sẽ redirect về trang login và lại gọi API
						location.href = "/login";
					}
				}
			} else {
				// server side
				const accsessToken = (options?.headers as any)?.Authorization.split(
					"Bearer "
				)[1];

				redirect("/logout?accsessToken=" + accsessToken);
			}
		}
		throw new HttpError(data);
	}

	// đảm bảo url chạy ở client side
	if (isClient) {
		const normalizeUrl = normalizePath(url);
		if (normalizeUrl === "api/auth/login") {
			const { accessToken, refreshToken } = (payload as LoginResType).data;
			localStorage.setItem("accsessToken", accessToken);
			localStorage.setItem("refreshToken", refreshToken);
		}
		if (normalizeUrl === "api/auth/logout") {
			localStorage.removeItem("accsessToken");
			localStorage.removeItem("refreshToken");
		}
	}

	return data;
};

const http = {
	get: <Response>(url: string, options?: Omit<CustomOptions, "body">) =>
		request<Response>("GET", url, options),
	post: <Response>(
		url: string,
		body: any,
		options?: Omit<CustomOptions, "body">
	) => request<Response>("POST", url, { ...options, body }),
	put: <Response>(
		url: string,
		body: any,
		options?: Omit<CustomOptions, "body">
	) => request<Response>("PUT", url, { ...options, body }),
	delete: <Response>(url: string, options?: Omit<CustomOptions, "body">) =>
		request<Response>("DELETE", url, options),
};

export default http;
