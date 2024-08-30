"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import { formatCurrency } from "../../../lib/utils";
import { useGetDishListQuery } from "../../../queries/useDish";
import { GuestCreateOrdersBodyType } from "../../../schemaValidations/guest.schema";
import Quantity from "./quantity";

export default function MenuOrder() {
	const { data } = useGetDishListQuery();
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

	return (
		<>
			{dishes.map((dish) => (
				<div key={dish.id} className="flex gap-4">
					<div className="flex-shrink-0">
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
				<Button className="w-full justify-between">
					<span>Giỏ hàng · {order.length} món</span>
					<span>{formatCurrency(totalPrice)}</span>
				</Button>
			</div>
		</>
	);
}
