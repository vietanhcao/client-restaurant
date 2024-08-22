import { useMutation, useQuery } from "@tanstack/react-query";
import accountApiRequest from "../apiRequests/account";
import { AccountResType } from "../schemaValidations/account.schema";

export const useAccoutMe = (
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
}