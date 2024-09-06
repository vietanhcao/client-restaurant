"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useLocale, useTranslations } from "next-intl";
import { Locale, locales } from "../config";
import { usePathname, useRouter } from "../i18n/routing";

export default function SwitchLanguage() {
	const t = useTranslations("SwitchLanguage");
	const locale = useLocale();
	const pathname = usePathname();
	const router = useRouter();

	return (
		<Select
			value={locale}
			onValueChange={(value: Locale) => {
				router.replace(pathname, { locale: value });
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
