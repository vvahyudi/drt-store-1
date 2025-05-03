// src/components/products/product-grid.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Product, Pagination } from "@/types/api"
import ProductCard from "./product-card"

interface ProductGridProps {
	products: Product[]
	pagination: Pagination
}

export default function ProductGrid({
	products,
	pagination,
}: ProductGridProps) {
	const { page, total_page } = pagination

	if (products.length === 0) {
		return (
			<div className="text-center py-12">
				<h3 className="text-lg font-medium">No products found</h3>
				<p className="text-gray-500 mt-2">
					Try adjusting your search or filter criteria.
				</p>
			</div>
		)
	}

	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			{total_page > 1 && (
				<div className="flex justify-center mt-8">
					<div className="flex items-center space-x-1">
						<Link
							href={`?page=${Math.max(1, page - 1)}`}
							className={`p-2 rounded-md ${
								page <= 1
									? "text-gray-400 cursor-not-allowed"
									: "text-gray-700 hover:bg-gray-100"
							}`}
							aria-disabled={page <= 1}
							tabIndex={page <= 1 ? -1 : 0}
						>
							<ChevronLeft className="h-5 w-5" />
						</Link>

						{Array.from({ length: total_page }, (_, i) => i + 1).map(
							(pageNum) => (
								<Link
									key={pageNum}
									href={`?page=${pageNum}`}
									className={`px-3 py-1 rounded-md ${
										pageNum === page
											? "bg-primary text-white"
											: "text-gray-700 hover:bg-gray-100"
									}`}
								>
									{pageNum}
								</Link>
							),
						)}

						<Link
							href={`?page=${Math.min(total_page, page + 1)}`}
							className={`p-2 rounded-md ${
								page >= total_page
									? "text-gray-400 cursor-not-allowed"
									: "text-gray-700 hover:bg-gray-100"
							}`}
							aria-disabled={page >= total_page}
							tabIndex={page >= total_page ? -1 : 0}
						>
							<ChevronRight className="h-5 w-5" />
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}
