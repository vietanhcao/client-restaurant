"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useGuestOrderListQuery } from "../../../queries/useGuest";
import Image from "next/image";
import { formatCurrency, getVietnameseOrderStatus } from "../../../lib/utils";
import { Badge } from "../../../components/ui/badge";
import socket from "../../../lib/socket";
import { PayGuestOrdersResType, UpdateOrderResType } from "../../../schemaValidations/order.schema";
import { toast } from "../../../components/ui/use-toast";
import { OrderStatus } from "../../../constants/type";

export default function OrderCard() {
	const { data, refetch } = useGuestOrderListQuery();
	const orders = useMemo(() => data?.payload.data ?? [], [data]);

	const { waitingForPaying, paid } = useMemo(() => {
		return orders.reduce(
			(acc, item) => {
				if (
					item.status === OrderStatus.Pending ||
					item.status === OrderStatus.Delivered ||
					item.status === OrderStatus.Processing
				) {
					acc.waitingForPaying.quantity += item.quantity;
					acc.waitingForPaying.price += item.dishSnapshot.price * item.quantity;
				} else if (item.status === OrderStatus.Paid) {
					acc.paid.quantity += item.quantity;
					acc.paid.price += item.dishSnapshot.price * item.quantity;
				}

				return acc;
			},
			{
				waitingForPaying: {
					price: 0,
					quantity: 0,
				},
				paid: {
					price: 0,
					quantity: 0,
				},
			}
		);
	}, [orders]);

	useEffect(() => {
		if (socket.connected) {
			onConnect();
		}

		function onConnect() {
			console.log("Connected to socket", socket.id);
		}

		function onDisconnect() {
			console.log("Disconnected from socket");
		}

		function onUpdateOrder(data: UpdateOrderResType["data"]) {
			console.log("Update order", data);
			toast({
				description: `Món ăn ${data.dishSnapshot.name} (SL: ${
					data.quantity
				}) đã được cập nhật thành "${getVietnameseOrderStatus(data.status)}"`,
			});
			refetch();
		}
		
		function onPayment(data: PayGuestOrdersResType["data"]) {
			const { guest } = data[0];
			toast({
				description: `${guest?.name} tại bàn ${guest?.tableNumber} đã thanh toán cho đơn hàng`,
			});
			refetch();
		}

		socket.on("update-order", onUpdateOrder);
		socket.on("payment", onPayment);
		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("update-order", onUpdateOrder);
			socket.off("payment", onPayment);
		};
	}, [refetch]);

	return (
		<>
			{orders.map((order, index: number) => (
				<div key={order.id} className={"flex gap-4"}>
					<div className="text-sm font-semibold">{index + 1}</div>
					<div className="flex-shrink-0">
						<Image
							src={order.dishSnapshot.image}
							alt={order.dishSnapshot.name}
							height={100}
							width={100}
							quality={100}
							className="object-cover w-[80px] h-[80px] rounded-md"
						/>
					</div>
					<div className="space-y-1">
						<h3 className="text-sm">{order.dishSnapshot.name}</h3>
						<p className="text-xs font-semibold">
							{formatCurrency(order.dishSnapshot.price)} x{" "}
							<Badge className="px-1">{order.quantity}</Badge>
						</p>
					</div>
					<div className="flex-shrink-0 ml-auto flex justify-center items-center">
						<Badge variant={"outline"}>
							{getVietnameseOrderStatus(order.status)}
						</Badge>
					</div>
				</div>
			))}
			{paid.quantity !== 0 && (
				<div className="sticky bottom-0 ">
					<div className="w-full flex justify-between gap-4 text-xl font-semibold">
						<span>Đơn chưa thanh toán · {waitingForPaying.quantity} món</span>
						<span>{formatCurrency(waitingForPaying.price)}</span>
					</div>
				</div>
			)}
			<div className="sticky bottom-0 ">
				<div className="w-full flex justify-between gap-4 text-xl font-semibold">
					<span>Đơn đã thanh toán · {paid.quantity} món</span>
					<span>{formatCurrency(paid.price)}</span>
				</div>
			</div>
		</>
	);
}
