import { useMutation, useQuery } from "@tanstack/react-query";
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
};

export const useGuestOrderMutation = () => {
	return useMutation({
		mutationFn: guestApiRequest.order,
	});
};

export const useGuestOrderListQuery = () => {
	return useQuery({
		queryKey: ["guest-orders"],
		queryFn: guestApiRequest.getOrderList,
	});
};
