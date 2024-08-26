import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import accountApiRequest from "../apiRequests/account";
import {
	AccountResType,
	UpdateEmployeeAccountBodyType,
} from "../schemaValidations/account.schema";

export const useAccoutMe = (onSuccess?: (data: AccountResType) => void) => {
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

export const useGetAccountList = () => {
	return useQuery({
		queryKey: ["accounts"],
		queryFn: accountApiRequest.list,
	});
};

export const useGetAccount = ({ id }: { id: number }) => {
	return useQuery({
		queryKey: ["account", id],
		queryFn: () => accountApiRequest.getEmployee(id),
	});
};

export const useAddAccountMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: accountApiRequest.addEmployee,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["accounts"],
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
			});
		},
	});
}
