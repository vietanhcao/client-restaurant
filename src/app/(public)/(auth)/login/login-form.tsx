"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "../../../../queries/useAuth";
import { toast } from "../../../../components/ui/use-toast";
import {
	handleErrorApi,
	removeTokensFromLocalStorage,
} from "../../../../lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAppConext } from "../../../../components/app-provider";

export default function LoginForm() {
	const loginMutation = useLoginMutation();
	const route = useRouter();
	const searchParams = useSearchParams();
	const clearTokens = searchParams.get("clearTokens");
	const { setRole } = useAppConext();

	const form = useForm<LoginBodyType>({
		resolver: zodResolver(LoginBody),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		if (clearTokens) {
			setRole(undefined);
		}
	}, [clearTokens, setRole]);

	const onSubmit = async (data: LoginBodyType) => {
		if (loginMutation.isPending) return;
		try {
			const res = await loginMutation.mutateAsync(data);

			toast({
				title: "Đăng nhập thành công",
				description: res.payload.message,
			});
			setRole(res.payload.data.account.role);
			route.push("/manage/dashboard");
		} catch (error) {
			handleErrorApi({
				error,
				setError: form.setError,
			});
		}
	};

	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Đăng nhập</CardTitle>
				<CardDescription>
					Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
						onSubmit={form.handleSubmit(onSubmit, console.error)}
						noValidate
					>
						<div className="grid gap-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<div className="grid gap-2">
											<Label htmlFor="email">Email</Label>
											<Input
												id="email"
												type="email"
												placeholder="m@example.com"
												required
												{...field}
											/>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<div className="grid gap-2">
											<div className="flex items-center">
												<Label htmlFor="password">Password</Label>
											</div>
											<Input
												id="password"
												type="password"
												required
												{...field}
											/>
											<FormMessage />
										</div>
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								Đăng nhập
							</Button>
							<Button variant="outline" className="w-full" type="button">
								Đăng nhập bằng Google
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
