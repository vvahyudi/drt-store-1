import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function ShopLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<Header />
			<main className="flex-1">{children}</main>
			<Footer />
		</>
	)
}
