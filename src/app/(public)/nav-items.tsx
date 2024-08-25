"use client";

import Link from "next/link";
import { getAccessTokenFromLocalStorage } from "../../lib/utils";
import { use, useEffect, useState } from "react";
import { useAppConext } from "../../components/app-provider";

const menuItems = [
	{
		title: "Món ăn",
		href: "/menu",
	},
	{
		title: "Đơn hàng",
		href: "/orders",
		authRequired: true,
	},
	{
		title: "Đăng nhập",
		href: "/login",
		authRequired: false,
	},
	{
		title: "Quản lý",
		href: "/manage/dashboard",
		authRequired: true,
	},
];

export default function NavItems({ className }: { className?: string }) {
	const { isAuth } = useAppConext();

	return menuItems.map((item) => {
		if (item.authRequired === false && isAuth) {
			return null;
		}

		if (item.authRequired === true && !isAuth) {
			return null;
		}

		return (
			<Link href={item.href} key={item.href} className={className}>
				{item.title}
			</Link>
		);
	});
}
