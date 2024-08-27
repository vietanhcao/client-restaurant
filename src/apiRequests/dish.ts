import http from "../lib/http";
import {
	DishListResType,
	AccountResType,
	ChangePasswordBodyType,
	CreateDishBodyType,
	UpdateEmployeeAccountBodyType,
	UpdateMeBodyType,
} from "../schemaValidations/account.schema";

const dishApiRequest = {
	list: () => http.get<DishListResType>("/dishes"),
	add: (body: CreateDishBodyType) =>
		http.post<DishResType>("/dishes", body),
	updateDish: (id: number, body: UpdateDishBodyType) =>
		http.put<DishResType>(`/dishes/${id}`, body),
	getDish: (id: number) =>
		http.get<DishResType>(`/dishes/${id}`),
	deleteDish: (id: number) =>
		http.delete<DishResType>(`/dishes/${id}`),
};

export default dishApiRequest;
