import { type ClassValue, clsx } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "../components/ui/use-toast";

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
