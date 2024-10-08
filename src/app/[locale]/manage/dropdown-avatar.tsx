"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useLogoutMutation } from "../../../queries/useAuth";
import { handleErrorApi } from "../../../lib/utils";
import { useRouter } from "@/i18n/routing";
import { useAccoutMeQuery } from "../../../queries/useAccount";
import useAppStore from "@/store/useAppStore";

export default function DropdownAvatar() {
	const logoutMutation = useLogoutMutation();
	const router = useRouter();
	const { data } = useAccoutMeQuery();
	const { setRole, disconnectSocket } = useAppStore();

	const account = data?.payload.data;

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
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="overflow-hidden rounded-full"
				>
					<Avatar>
						<AvatarImage
							src={account?.avatar ?? undefined}
							alt={account?.name}
						/>
						<AvatarFallback>
							{account?.name.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href={"/manage/setting"} className="cursor-pointer">
						Cài đặt
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
