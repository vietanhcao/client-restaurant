import { useMutation, useQuery } from "@tanstack/react-query";
import orderApiRequest from "../apiRequests/order";
import {
	GetOrdersQueryParamsType,
	PayGuestOrdersBodyType,
	UpdateOrderBodyType,
} from "../schemaValidations/order.schema";

export const useUpdateOrderMutation = () => {
	return useMutation({
		mutationFn: ({
			orderId,
			...body
		}: UpdateOrderBodyType & { orderId: number }) =>
			orderApiRequest.updateOrder(orderId, body),
	});
};

export const useGetOrderListQuery = (queryParams: GetOrdersQueryParamsType) => {
	return useQuery({
		queryFn: () => orderApiRequest.getOrderList(queryParams),
		queryKey: ["orderList", queryParams],
	});
};

export const useGetOrderDetailQuery = ({
	id,
	enable,
}: {
	id: number;
	enable: boolean;
}) => {
	return useQuery({
		queryFn: () => orderApiRequest.getOrderDetail(id),
		queryKey: ["orders", id],
		enabled: enable,
	});
};

export const usePayForGuestMutation = () => {
	return useMutation({
		mutationFn: orderApiRequest.pay,
	});
};
