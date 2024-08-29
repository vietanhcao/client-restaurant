"use client";

import Link from "next/link";
import {
	cn,
	getAccessTokenFromLocalStorage,
	handleErrorApi,
} from "../../lib/utils";
import { use, useEffect, useState } from "react";
import { useAppConext } from "../../components/app-provider";
import { Role } from "../../constants/type";
import { RoleType } from "../../types/jwt.types";
import { useLogoutMutation } from "../../queries/useAuth";
import { useRouter } from "next/navigation";

const menuItems: {
	title: string;
	href: string;
	role?: RoleType[];
	hideWhenLoggedIn?: boolean;
}[] = [
	{
		title: "Trang chủ",
		href: "/",
	},
	{
		title: "Menu",
		href: "/guest/menu",
		role: [Role.Guest],
	},
	{
		title: "Đăng nhập",
		href: "/login",
		hideWhenLoggedIn: true,
	},
	{
		title: "Quản lý",
		href: "/manage/dashboard",
		role: [Role.Owner, Role.Employee],
	},
];

export default function NavItems({ className }: { className?: string }) {
	const router = useRouter();
	const logoutMutation = useLogoutMutation();
	const { setRole, role } = useAppConext();

	const handleLogout = async () => {
		if (logoutMutation.isPending) return;
		try {
			await logoutMutation.mutateAsync();
			router.push("/");
			setRole(undefined);
		} catch (error) {
			handleErrorApi({
				error,
			});
		}
	};

	return (
		<>
			{menuItems.map((item) => {
				// case đăng nhập hiển thị menu item đăng nhập
				const isAuth = item.role && role && item.role.includes(role);
				// case menu item có thể hiển thị dù đã đăng nhập hay chưa
				const canShow =
					(item.role === undefined && !item.hideWhenLoggedIn) ||
					(item.hideWhenLoggedIn && !role);

				if (isAuth || canShow) {
					return (
						<Link href={item.href} key={item.href} className={className}>
							{item.title}
						</Link>
					);
				}

				return null;
			})}
			{role && (
				<div className={cn(className, "cursor-pointer")} onClick={handleLogout}>
					Đăng xuất
				</div>
			)}
		</>
	);
}
