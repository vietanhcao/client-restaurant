import Layout from "../(public)/layout";
import { defaultLocale } from "../../../config";

export default function GuestLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Layout modal={null} params={{ locale: defaultLocale }}>
			{children}
		</Layout>
	);
}
