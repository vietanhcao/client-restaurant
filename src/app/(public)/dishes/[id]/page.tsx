import dishApiRequest from "../../../../apiRequests/dish";
import { wrapServerApi } from "../../../../lib/utils";
import DishDetail from "./dish-detail";

interface DishPageProps {
	params: {
		id: string;
	};
}

export default async function DishPage({ params }: DishPageProps) {
	const res = await wrapServerApi(() => dishApiRequest.getDish(+params.id));
	let dish = res?.payload.data;

	return <DishDetail dish={dish} />;
}
