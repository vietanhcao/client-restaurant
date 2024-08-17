import { useMutation } from "@tanstack/react-query";
import authApiRequest from "../apiRequests/auth";

// This is a custom hook to login a user
export const useLoginMutation = () => {
	return useMutation({
		mutationFn: authApiRequest.login,
	});
};
