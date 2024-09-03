import Image from "next/image";
import dishApiRequest from "../../../../apiRequests/dish";
import { formatCurrency, wrapServerApi } from "../../../../lib/utils";

interface DishPageProps {
	params: {
		id: string;
	};
}

export default async function DishPage({ params }: DishPageProps) {
	const res = await wrapServerApi(() => dishApiRequest.getDish(+params.id));
	if (!res) return <div>Không tìm thấy món ăn</div>;
	let dish = res?.payload.data;

	return (
		<div className="space-y-4">
			<h1 className="text-2xl lg:text-3xl font-semibold">{dish.name}</h1>
			<div className="font-semibold">Giá: {formatCurrency(dish.price)}</div>
			<p>{dish.description}</p>
		</div>
	);
}
