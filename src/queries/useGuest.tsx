import { useMutation } from "@tanstack/react-query";
import guestApiRequest from "../apiRequests/guest";

// This is a custom hook to login a user
export const useGuestLoginMutation = () => {
	return useMutation({
		mutationFn: guestApiRequest.login,
	});
};

export const useGuestLogoutMutation = () => {
	return useMutation({
		mutationFn: guestApiRequest.logout,
	});
}