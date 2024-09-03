import Layout from "../(public)/layout";

export default function GuestLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Layout modal={null}>{children}</Layout>;
}
