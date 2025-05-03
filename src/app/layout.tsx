import type { Metadata } from "next"
import { Geist, Geist_Mono, Roboto_Serif } from "next/font/google"
import "@/styles/globals.css"
import Providers from "./providers"
import { ErrorBoundaryProvider } from "@/components/providers/error-boundary-provider"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap",
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	display: "swap",
})

const robotoSerif = Roboto_Serif({
	variable: "--font-roboto-serif",
	subsets: ["latin"],
	display: "swap",
})

export const metadata: Metadata = {
	title: {
		default: "DRT-Store - Toko Online Terpercaya",
		template: "%s | DRT-Store",
	},
	description: "Temukan produk berkualitas dengan harga terjangkau",
	keywords: ["toko online", "belanja online", "e-commerce", "produk indonesia"],
	authors: [{ name: "Tim DRT Store" }],
	creator: "DRT Store",
	openGraph: {
		type: "website",
		locale: "id_ID",
		url: "https://drt-store.com",
		title: "DRT-Store - Toko Online Terpercaya",
		description: "Temukan produk berkualitas dengan harga terjangkau",
		siteName: "DRT-Store",
	},
	twitter: {
		card: "summary_large_image",
		title: "DRT-Store - Toko Online Terpercaya",
		description: "Temukan produk berkualitas dengan harga terjangkau",
		creator: "@drtstore",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="id" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${robotoSerif.variable} min-h-screen flex flex-col`}
			>
				<ErrorBoundaryProvider>
					<Providers>{children}</Providers>
				</ErrorBoundaryProvider>
			</body>
		</html>
	)
}
