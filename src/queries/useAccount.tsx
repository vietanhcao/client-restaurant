import { useQuery } from "@tanstack/react-query";
import accountApiRequest from "../apiRequests/account";
import { AccountResType } from "../schemaValidations/account.schema";

export const useAccoutProfile = (
	onSuccess?: (data: AccountResType) => void
) => {
	return useQuery({
		queryKey: ["account-profile"],
		queryFn: () =>
			accountApiRequest.me().then((res) => {
				if (onSuccess) {
					onSuccess(res.payload);
				}
				return res;
			}),
	});
};
