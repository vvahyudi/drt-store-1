import { useState, useCallback } from "react"
import { Product } from "@/types/api"

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "https://drtstore-backend.vercel.app/api"

interface UseProductReturn {
	isLoading: boolean
	error: Error | null
	fetchProduct: (id: string) => Promise<Product | null>
	fetchProducts: (params?: {
		page?: number
		limit?: number
		category?: string
		search?: string
	}) => Promise<{ products: Product[]; total: number }>
}

export function useProduct(): UseProductReturn {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const handleError = (err: unknown) => {
		if (err instanceof Error) {
			setError(err)
		} else if (typeof err === "string") {
			setError(new Error(err))
		} else {
			setError(new Error("An unexpected error occurred"))
		}
	}

	const fetchProduct = useCallback(
		async (id: string): Promise<Product | null> => {
			try {
				setIsLoading(true)
				setError(null)

				const response = await fetch(`${API_BASE_URL}/products/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				})

				if (!response.ok) {
					const errorData = await response.json().catch(() => null)
					throw new Error(
						errorData?.message ||
							`Failed to fetch product: ${response.statusText}`,
					)
				}

				const data = await response.json()
				return data
			} catch (err) {
				handleError(err)
				return null
			} finally {
				setIsLoading(false)
			}
		},
		[],
	)

	const fetchProducts = useCallback(
		async (params?: {
			page?: number
			limit?: number
			category?: string
			search?: string
		}): Promise<{ products: Product[]; total: number }> => {
			try {
				setIsLoading(true)
				setError(null)

				const queryParams = new URLSearchParams()
				if (params?.page) queryParams.append("page", params.page.toString())
				if (params?.limit) queryParams.append("limit", params.limit.toString())
				if (params?.category) queryParams.append("category", params.category)
				if (params?.search) queryParams.append("search", params.search)

				const response = await fetch(
					`${API_BASE_URL}/products?${queryParams.toString()}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					},
				)

				if (!response.ok) {
					const errorData = await response.json().catch(() => null)
					throw new Error(
						errorData?.message ||
							`Failed to fetch products: ${response.statusText}`,
					)
				}

				const data = await response.json()
				return data
			} catch (err) {
				handleError(err)
				return { products: [], total: 0 }
			} finally {
				setIsLoading(false)
			}
		},
		[],
	)

	return {
		isLoading,
		error,
		fetchProduct,
		fetchProducts,
	}
}
