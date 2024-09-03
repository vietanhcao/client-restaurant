import Image from "next/image";
import dishApiRequest from "../../../../apiRequests/dish";
import { formatCurrency, wrapServerApi } from "../../../../lib/utils";
import { DishResType } from "../../../../schemaValidations/dish.schema";

interface DishDetailProps {
	dish?: DishResType["data"];
}

export default async function DishDetail({ dish }: DishDetailProps) {
	if (!dish) return <div>Không tìm thấy món ăn</div>;
	return (
		<div className="space-y-4">
			<h1 className="text-2xl lg:text-3xl font-semibold">{dish.name}</h1>
			<div className="font-semibold">Giá: {formatCurrency(dish.price)}</div>
			<div className="flex-shrink-0">
				<Image
					src={dish.image}
					width={700}
					height={700}
					quality={100}
					className="object-cover w-full h-full max-w-[1080px] max-h-[1080px] rounded-md"
					alt={dish.name}
				/>
			</div>
			<p>{dish.description}</p>
		</div>
	);
}
