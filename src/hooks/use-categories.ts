// src/hooks/use-categories.ts
import { useQuery } from "@tanstack/react-query"
import { categoryAPI } from "@/lib/api"
import { ApiResponse, Category, Pagination } from "@/types/api"

interface UseCategoriesParams {
	page?: number
	limit?: number
	sort?: string
	search?: string
}

export function useCategories(params: UseCategoriesParams = {}) {
	const { page = 1, limit = 20, sort = "name.asc", search = "" } = params

	return useQuery<ApiResponse<Category[]>>({
		queryKey: ["categories", page, limit, sort, search],
		queryFn: () => categoryAPI.getAll({ page, limit, sort, search }),
	})
}

export function useCategory(slug: string) {
	return useQuery({
		queryKey: ["category", slug],
		queryFn: () => categoryAPI.getBySlug(slug),
		enabled: !!slug,
	})
}

export function useCategoryById(id: string) {
	return useQuery({
		queryKey: ["category", id],
		queryFn: () => categoryAPI.getById(id),
		enabled: !!id,
	})
}
