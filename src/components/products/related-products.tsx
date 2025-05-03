// src/components/products/related-products.tsx
"use client"

import { useEffect, useState } from "react"
import { Product } from "@/types/api"
import ProductCard from "./product-card"
import { productAPI } from "@/lib/api"

interface RelatedProductsProps {
	categoryId: string
	currentProductId: string
}

export default function RelatedProducts({
	categoryId,
	currentProductId,
}: RelatedProductsProps) {
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchRelatedProducts = async () => {
			try {
				setIsLoading(true)
				// Fetch products from the same category
				const response = await productAPI.getAll({
					limit: 4,
					// In a real application, you would have an API endpoint to fetch related products directly
				})

				// Filter out the current product and limit to 3
				const filtered = response.data
					.filter(
						(product: Product) =>
							product.id !== currentProductId &&
							product.category_id === categoryId,
					)
					.slice(0, 3)

				setRelatedProducts(filtered)
			} catch (error) {
				console.error("Error fetching related products:", error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchRelatedProducts()
	}, [categoryId, currentProductId])

	if (isLoading) {
		return (
			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-4">Related Products</h2>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
					{Array.from({ length: 3 }).map((_, i) => (
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

	if (relatedProducts.length === 0) return null

	return (
		<div className="mt-12">
			<h2 className="text-2xl font-bold mb-4">Related Products</h2>
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
				{relatedProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	)
}
