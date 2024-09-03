import dishApiRequest from "../../../../../apiRequests/dish";
import { wrapServerApi } from "../../../../../lib/utils";
import DishDetail from "../../../dishes/[id]/dish-detail";
import Modal from "./modal";

interface DishPageProps {
	params: {
		id: string;
	};
}

export default async function DishPage({ params }: DishPageProps) {
	const res = await wrapServerApi(() => dishApiRequest.getDish(+params.id));
	let dish = res?.payload.data;

	return (
		<Modal>
			<DishDetail dish={dish} />
		</Modal>
	);
}
