"use client"

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary"
import { Button } from "./ui/button"

const ErrorFallback = ({
	error,
	resetErrorBoundary,
}: {
	error: Error
	resetErrorBoundary: () => void
}) => {
	return (
		<div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-4 text-center">
			<h2 className="text-2xl font-bold text-red-600">Terjadi Kesalahan!</h2>
			<pre className="rounded-lg bg-gray-100 p-4 text-sm">{error.message}</pre>
			<Button onClick={resetErrorBoundary} variant="outline">
				Coba Lagi
			</Button>
		</div>
	)
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
	return (
		<ReactErrorBoundary
			FallbackComponent={ErrorFallback}
			onReset={() => {
				window.location.reload()
			}}
		>
			{children}
		</ReactErrorBoundary>
	)
}
