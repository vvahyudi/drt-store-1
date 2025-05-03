"use client"

import { ErrorBoundary } from "@/components/error-boundary"

export function ErrorBoundaryProvider({
	children,
}: {
	children: React.ReactNode
}) {
	return <ErrorBoundary>{children}</ErrorBoundary>
}
