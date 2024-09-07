import { unstable_setRequestLocale } from "next-intl/server";
import dishApiRequest from "../../../../../apiRequests/dish";
import {
	generateSlugUrl,
	getIdFromSlugUrl,
	wrapServerApi,
} from "../../../../../lib/utils";
import DishDetail from "./dish-detail";

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
	const res = await wrapServerApi(() => dishApiRequest.list());
	const list = res?.payload.data ?? [];

	return list.map((dish) => ({
		slug: generateSlugUrl({ name: dish.name, id: dish.id }),
	}));
}

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

	return <DishDetail dish={dish} />;
}
