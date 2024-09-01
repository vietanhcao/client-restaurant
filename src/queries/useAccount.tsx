import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import accountApiRequest from "../apiRequests/account";
import {
	AccountResType,
	GetGuestListQueryParamsType,
	UpdateEmployeeAccountBodyType,
} from "../schemaValidations/account.schema";

export const useAccoutMeQuery = (
	onSuccess?: (data: AccountResType) => void
) => {
	return useQuery({
		queryKey: ["account-me"],
		queryFn: () =>
			accountApiRequest.me().then((res) => {
				if (onSuccess) {
					onSuccess(res.payload);
				}
				return res;
			}),
	});
};

export const useUpdateMeMutation = () => {
	return useMutation({
		mutationFn: accountApiRequest.updateMe,
	});
};

export const useChangePasswordMutation = () => {
	return useMutation({
		mutationFn: accountApiRequest.changePassword,
	});
};

export const useGetAccountListQuery = () => {
	return useQuery({
		queryKey: ["accounts"],
		queryFn: accountApiRequest.list,
	});
};

export const useGetAccountQuery = ({
	id,
	enabled,
}: {
	id: number;
	enabled: boolean;
}) => {
	return useQuery({
		queryKey: ["accounts", id],
		queryFn: () => accountApiRequest.getEmployee(id),
		enabled,
	});
};

export const useAddAccountMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: accountApiRequest.addEmployee,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["accounts"],
				exact: true,
			});
		},
	});
};

export const useUpdateAccountMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			...body
		}: UpdateEmployeeAccountBodyType & { id: number }) =>
			accountApiRequest.updateEmployee(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["accounts"],
				exact: true,
			});
		},
	});
};

export const useDeleteAccountMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: accountApiRequest.deleteEmployee,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["accounts"],
				exact: true,
			});
		},
	});
};

export const useGetGuestListQuery = (
	queryParams: GetGuestListQueryParamsType
) => {
	return useQuery({
		queryFn: () => accountApiRequest.guestList(queryParams),
		queryKey: ["guests", queryParams],
	});
};

export const useCreateGuestMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: accountApiRequest.createGuest,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["guests"],
				exact: true,
			});
		},
	});
}
