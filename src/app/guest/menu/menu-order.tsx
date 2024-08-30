"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import { cn, formatCurrency, handleErrorApi } from "../../../lib/utils";
import { useGetDishListQuery } from "../../../queries/useDish";
import { GuestCreateOrdersBodyType } from "../../../schemaValidations/guest.schema";
import Quantity from "./quantity";
import { useGuestOrderMutation } from "../../../queries/useGuest";
import { useRouter } from "next/navigation";
import { DishStatus } from "../../../constants/type";

export default function MenuOrder() {
	const { data } = useGetDishListQuery();
	const guestOrderMutation = useGuestOrderMutation();
	const router = useRouter();
	const dishes = useMemo(() => data?.payload.data ?? [], [data]);
	const [order, setOrder] = useState<GuestCreateOrdersBodyType>([]);

	const totalPrice = useMemo(() => {
		return order.reduce((acc, item) => {
			const dish = dishes.find((d) => d.id === item.dishId);
			if (!dish) return acc;
			return acc + dish.price * item.quantity;
		}, 0);
	}, [dishes, order]);

	const handleQuantityChange = (dishId: number, quantity: number) => {
		if (quantity === 0) {
			const newOrder = order.filter((item) => item.dishId !== dishId);
			setOrder(newOrder);
			return;
		}

		// create and update order
		const orderItem = order.find((item) => item.dishId === dishId);
		if (orderItem) {
			const newOrder = order.map((item) =>
				item.dishId === dishId ? { ...item, quantity } : item
			);
			setOrder(newOrder);
			return;
		}

		const newOrder = [...order, { dishId, quantity }];
		setOrder(newOrder);
	};

	const handleOrder = async () => {
		if (guestOrderMutation.isPending) return;
		try {
			const res = await guestOrderMutation.mutateAsync(order);
			router.push("/guest/orders");
			setOrder([]);
		} catch (error) {
			handleErrorApi({
				error,
			});
		}
	};

	return (
		<>
			{dishes
				.filter((dish) => dish.status !== DishStatus.Hidden)
				.map((dish) => (
					<div
						key={dish.id}
						className={cn(
							"flex gap-4",
							dish.status === DishStatus.Unavailable && "opacity-50 pointer-events-none"
						)}
					>
						<div className="flex-shrink-0 relative">
							<span className="absolute inset-0  text-white flex items-center justify-center rounded-md">
								{dish.status === DishStatus.Unavailable && "Hết hàng"}
							</span>
							<Image
								src={dish.image}
								alt={dish.name}
								height={100}
								width={100}
								quality={100}
								className="object-cover w-[80px] h-[80px] rounded-md"
							/>
						</div>
						<div className="space-y-1">
							<h3 className="text-sm">{dish.name}</h3>
							<p className="text-xs">{dish.description}</p>
							<p className="text-xs font-semibold">
								{formatCurrency(dish.price)}
							</p>
						</div>
						<div className="flex-shrink-0 ml-auto flex justify-center items-center">
							<Quantity
								onChange={(v) => handleQuantityChange(dish.id, v)}
								value={
									order.find((item) => item.dishId === dish.id)?.quantity ?? 0
								}
							/>
						</div>
					</div>
				))}
			<div className="sticky bottom-0">
				<Button
					onClick={handleOrder}
					className="w-full justify-between"
					disabled={order.length === 0}
				>
					<span>Đặt hàng · {order.length} món</span>
					<span>{formatCurrency(totalPrice)}</span>
				</Button>
			</div>
		</>
	);
}
