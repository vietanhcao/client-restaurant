import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "../components/app-provider";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});
export const metadata: Metadata = {
	title: "Big Boy Restaurant",
	description: "The best restaurant in the world",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();

	// Providing all messages to the client
	// side is the easiest way to get started
	const messages = await getMessages();
	return (
		<html lang={locale} suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				<NextIntlClientProvider messages={messages}>
					<AppProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							{children}
							<Toaster />
						</ThemeProvider>
					</AppProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
