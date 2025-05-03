// src/components/products/products-loading.tsx
export default function ProductsLoading() {
	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className="bg-white rounded-lg shadow-sm overflow-hidden"
					>
						<div className="bg-gray-200 aspect-square animate-pulse" />
						<div className="p-4 space-y-3">
							<div className="h-4 bg-gray-200 rounded animate-pulse" />
							<div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
							<div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
