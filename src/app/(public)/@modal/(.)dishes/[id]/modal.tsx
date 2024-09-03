"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

import React from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [open, setOpen] = React.useState(true);
	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				setOpen(open);
				if (!open) {
					router.back();
				}
			}}
		>
			<DialogContent className="sm:max-w-[425px] overflow-auto">{children}</DialogContent>
		</Dialog>
	);
}
