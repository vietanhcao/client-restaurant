"use client";
import * as React from "react";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useLocale, useTranslations } from "next-intl";
import { Locale, locales } from "../config";
import {
	useParams,
	useSearchParams,
	usePathname,
	useRouter,
} from "next/navigation";

export function SwitchLanguage() {
	const t = useTranslations("SwitchLanguage");
	const locale = useLocale();
	const pathname = usePathname();
	const params = useParams();
	const router = useRouter();
	const searchParams = useSearchParams();

	return (
		<Select
			value={locale}
			onValueChange={(value: Locale) => {
				const locale = params.locale as Locale;
				const newPathName = pathname.replace(locale, value);
				const fullUrl = `${newPathName}?${searchParams.toString()}`;
				router.replace(fullUrl);
			}}
		>
			<SelectTrigger className="w-[140px]">
				<SelectValue placeholder={t("title")} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{locales.map((locale) => (
						<SelectItem key={locale} value={locale}>
							{t(locale)}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
