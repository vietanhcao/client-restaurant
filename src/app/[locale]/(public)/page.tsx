import Image from "next/image";
import { DishListResType } from "../../../schemaValidations/dish.schema";
import dishApiRequest from "../../../apiRequests/dish";
import {
	formatCurrency,
	generateSlugUrl,
	wrapServerApi,
} from "../../../lib/utils";
import { Link } from "@/i18n/routing";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export default async function Home({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
	const t = await getTranslations("HomePage");

	const res = await wrapServerApi(() => dishApiRequest.list());
	let dishList = res?.payload.data;
	try {
		const res = await dishApiRequest.list();
		const {
			payload: { data },
		} = res;
		dishList = data;
	} catch (error) {
		return <div>Something went wrong</div>;
	}

	return (
		<div className="w-full space-y-4">
			<section className="relative">
				<span className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></span>
				<Image
					src="/banner.png"
					width={400}
					height={200}
					quality={100}
					alt="Banner"
					className="absolute top-0 left-0 w-full h-full object-cover"
				/>
				<div className="z-10 relative py-10 md:py-20 px-4 sm:px-10 md:px-20">
					<h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold">
						{t("title")}
					</h1>
					<p className="text-center text-sm sm:text-base mt-4">
						Vị ngon, trọn khoảnh khắc
					</p>
				</div>
			</section>
			<section className="space-y-10 py-16">
				<h2 className="text-center text-2xl font-bold">Đa dạng các món ăn</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
					{dishList.map((dish) => (
						<Link
							href={`/dishes/${generateSlugUrl({
								name: dish.name,
								id: dish.id,
							})}`}
							className="flex gap-4 w"
							key={dish.id}
						>
							<div className="flex-shrink-0">
								<Image
									src={dish.image}
									width={150}
									height={150}
									quality={100}
									className="object-cover w-[150px] h-[150px] rounded-md"
									alt={dish.name}
								/>
							</div>
							<div className="space-y-1">
								<h3 className="text-xl font-semibold">{dish.name}</h3>
								<p className="">{dish.description}</p>
								<p className="font-semibold">{formatCurrency(dish.price)}</p>
							</div>
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}
