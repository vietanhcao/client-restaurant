"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "@/i18n/routing";
import useAppStore from "@/store/useAppStore";
import { useRouter } from "@/i18n/routing";
import { Role } from "../../../constants/type";
import { cn, handleErrorApi } from "../../../lib/utils";
import { useLogoutMutation } from "../../../queries/useAuth";
import { RoleType } from "../../../types/jwt.types";

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
		title: "Đơn hàng",
		href: "/guest/orders",
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
	const { setRole, role, disconnectSocket } = useAppStore();

	const handleLogout = async () => {
		if (logoutMutation.isPending) return;
		try {
			await logoutMutation.mutateAsync();
			router.push("/");
			setRole(undefined);
			disconnectSocket();
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
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<div className={cn(className, "cursor-pointer")}>Đăng xuất</div>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Bạn có muốn đăng xuất không?</AlertDialogTitle>
							<AlertDialogDescription>
								Việc đăng xuất làm mất đi hóa đơn của bạn
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Thoát</AlertDialogCancel>
							<AlertDialogAction onClick={handleLogout}>Ok</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</>
	);
}
