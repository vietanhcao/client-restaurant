import { unstable_setRequestLocale } from "next-intl/server";
import dishApiRequest from "../../../../../../apiRequests/dish";
import { getIdFromSlugUrl, wrapServerApi } from "../../../../../../lib/utils";
import DishDetail from "../../../dishes/[slug]/dish-detail";
import Modal from "./modal";

interface DishPageProps {
	params: {
		slug: string;
		locale: string;
	};
}

export default async function DishPage({ params }: DishPageProps) {
	unstable_setRequestLocale(params.locale);
	const id = getIdFromSlugUrl(params.slug);
	const res = await wrapServerApi(() => dishApiRequest.getDish(id));
	let dish = res?.payload.data;

	return (
		<Modal>
			<DishDetail dish={dish} />
		</Modal>
	);
}
