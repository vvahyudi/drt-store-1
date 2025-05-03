export function LoadingSpinner() {
	return (
		<div className="flex items-center justify-center p-4">
			<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
			<span className="ml-2 text-sm text-gray-600">Memuat...</span>
		</div>
	)
}

export function LoadingSkeleton() {
	return (
		<div className="animate-pulse space-y-4">
			<div className="h-4 w-3/4 rounded bg-gray-200"></div>
			<div className="h-4 w-1/2 rounded bg-gray-200"></div>
			<div className="h-4 w-2/3 rounded bg-gray-200"></div>
		</div>
	)
}

export function PageLoading() {
	return (
		<div className="flex min-h-[400px] items-center justify-center">
			<LoadingSpinner />
		</div>
	)
}
