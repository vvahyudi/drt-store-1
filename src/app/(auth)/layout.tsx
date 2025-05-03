import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
			<Link
				href="/"
				className="absolute top-4 left-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
			>
				<ArrowLeft className="mr-2 h-4 w-4" />
				Back to Home
			</Link>

			<div className="w-full max-w-md">
				<div className="mb-6 text-center">
					<Link href="/" className="text-2xl font-bold">
						DRT-Store
					</Link>
				</div>

				<div className="rounded-lg border bg-white p-8 shadow-sm">
					{children}
				</div>
			</div>
		</div>
	)
}
