import http from "../lib/http";
import {
	AccountListResType,
	AccountResType,
	ChangePasswordBodyType,
	CreateEmployeeAccountBodyType,
	CreateGuestBodyType,
	GetGuestListQueryParamsType,
	UpdateEmployeeAccountBodyType,
	UpdateMeBodyType,
} from "../schemaValidations/account.schema";
import queryString from "query-string";

const accountApiRequest = {
	me: () => http.get<AccountResType>("/accounts/me"),
	sMe: (accessToken: string) =>
		http.get<AccountResType>("/accounts/me", {
			headers: { Authorization: `Bearer ${accessToken}` },
		}),
	updateMe: (body: UpdateMeBodyType) =>
		http.put<AccountResType>("/accounts/me", body),
	changePassword: (body: ChangePasswordBodyType) =>
		http.put<AccountResType>("/accounts/change-password", body),
	list: () => http.get<AccountListResType>("/accounts"),
	addEmployee: (body: CreateEmployeeAccountBodyType) =>
		http.post<AccountResType>("/accounts", body),
	updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) =>
		http.put<AccountResType>(`/accounts/detail/${id}`, body),
	getEmployee: (id: number) =>
		http.get<AccountResType>(`/accounts/detail/${id}`),
	deleteEmployee: (id: number) =>
		http.delete<AccountResType>(`/accounts/detail/${id}`),
	guestList: (params: GetGuestListQueryParamsType) =>
		http.get<AccountListResType>(
			"/accounts/guests?" +
				queryString.stringify({
					fromDate: params.fromDate?.toISOString(),
					toDate: params.toDate?.toISOString(),
				})
		),
	createGuest: (body: CreateGuestBodyType) =>
		http.post<CreateGuestBodyType>("/accounts/guests", body),
};

export default accountApiRequest;
