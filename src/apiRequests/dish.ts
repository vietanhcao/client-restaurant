import http from "../lib/http";
import {
	CreateDishBodyType,
	DishListResType,
	DishResType,
	UpdateDishBodyType,
} from "../schemaValidations/dish.schema";

const dishApiRequest = {
	// Note: Nextjs 15 thì mặc định fetch sẽ là { cache: "no-cache" } dynamic rendering page
	// hiệnt tại Nextjs 14 thì fetch mặc định là { cache: "force-cache" } static rendering page
	list: () => http.get<DishListResType>("/dishes"),
	add: (body: CreateDishBodyType) => http.post<DishResType>("/dishes", body),
	updateDish: (id: number, body: UpdateDishBodyType) =>
		http.put<DishResType>(`/dishes/${id}`, body),
	getDish: (id: number) => http.get<DishResType>(`/dishes/${id}`),
	deleteDish: (id: number) => http.delete<DishResType>(`/dishes/${id}`),
};

export default dishApiRequest;
