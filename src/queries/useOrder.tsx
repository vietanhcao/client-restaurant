import { useMutation, useQuery } from "@tanstack/react-query";
import orderApiRequest from "../apiRequests/order";
import { UpdateOrderBodyType } from "../schemaValidations/order.schema";

export const useUpdateOrderMutation = () => {
	return useMutation({
		mutationFn: ({
			orderId,
			...body
		}: UpdateOrderBodyType & { orderId: number }) =>
			orderApiRequest.updateOrder(orderId, body),
	});
};

export const useGetOrderListQuery = () => {
	return useQuery({
		queryFn: orderApiRequest.getOrderList,
		queryKey: ["orderList"],
	});
};
