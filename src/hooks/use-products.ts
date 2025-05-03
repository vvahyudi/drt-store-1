import { useQuery } from "@tanstack/react-query"
import { productAPI } from "@/lib/api"
import { ApiResponse, Pagination, Product } from "@/types/api"

interface UseProductsParams {
	search?: string
	sort?: string
	limit?: number
	page?: number
	category_id?: string
}

export const useProductListQuery = (params: UseProductsParams = {}) => {
	const queryParams = {
		search: params.search || "",
		sort: params.sort || "created_at.desc",
		limit: params.limit || 12,
		page: params.page || 1,
		category_id: params.category_id || undefined,
	}

	return useQuery<ApiResponse<Product[]>>({
		queryKey: ["product-list", queryParams],
		queryFn: async () => {
			const filteredParams = Object.fromEntries(
				Object.entries(queryParams).filter(
					([_, value]) => value !== undefined && value !== "",
				),
			)

			return await productAPI.getAll(filteredParams)
		},
	})
}

export const useProductByIdQuery = (id?: string) => {
	return useQuery<ApiResponse<Product>>({
		queryKey: ["product-detail", id],
		queryFn: async () => await productAPI.getById(id!),
		enabled: !!id,
	})
}

export const useProductBySlugQuery = (slug?: string) => {
	return useQuery<ApiResponse<Product>>({
		queryKey: ["product-detail", slug],
		queryFn: async () => await productAPI.getBySlug(slug!),
		enabled: !!slug,
	})
}

// export function useProducts(params: UseProductsParams = {}) {
// 	const { page = 1, limit = 12, sort = "name.asc", search = "" } = params

// 	return useQuery<ApiResponse<Product[]> & { pagination: Pagination }>({
// 		queryKey: ["products", page, limit, sort, search],
// 		queryFn: () =>
// 			productAPI.getAll({ page, limit, sort, search }) as Promise<any>,
// 	})
// }

// export function useProduct(slug: string) {
// 	return useQuery({
// 		queryKey: ["product", slug],
// 		queryFn: () => productAPI.getBySlug(slug),
// 		enabled: !!slug,
// 	})
// }
