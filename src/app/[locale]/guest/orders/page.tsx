import OrderCard from "./order-card";

export default async function OrderPage() {
	return (
		<div className="max-w-[400px] mx-auto space-y-4">
			<h1 className="text-center text-xl font-bold">Đơn hàng</h1>
			<OrderCard />
		</div>
	);
}
