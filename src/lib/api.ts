// src/lib/api.ts
import axios from "axios"
import {
	Product,
	Category,
	ProductImage,
	ApiResponse,
	ProductRequest,
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RefreshTokenResponse,
	ProductQueryParams,
} from "@/types/api"
import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"

// Create a base axios instance
const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
})

// Add a request interceptor to include auth token
api.interceptors.request.use(
	async (config) => {
		// For browser environments only
		if (typeof window !== "undefined") {
			const session = await getSession()
			if (session?.user?.accessToken) {
				config.headers.Authorization = `Bearer ${session.user.accessToken}`
			}
		}
		return config
	},
	(error) => Promise.reject(error),
)

// Add a response interceptor to handle response
api.interceptors.response.use(
	(response) => {
		return response.data
	},
	(error) => {
		console.error("API Error:", error)
		return Promise.reject(error)
	},
)

export const productAPI = {
	getAll: (params?: ProductQueryParams): Promise<ApiResponse<Product[]>> => {
		// Memastikan category_id dikirim sebagai string
		const queryParams = {
			...params,
			category_id: params?.category_id ? String(params.category_id) : undefined,
		}
		return api.get("/product", { params: queryParams })
	},

	getById: (id: string): Promise<ApiResponse<Product>> =>
		api.get(`/product/${id}`),

	getBySlug: (slug: string): Promise<ApiResponse<Product>> =>
		api.get(`/product/slug/${slug}`),

	getByCategory: (
		categoryId: string,
		params?: {
			page?: number
			limit?: number
			sort?: string
			search?: string
		},
	): Promise<ApiResponse<Product[]>> => {
		return api.get(`/product/category/${categoryId}`, { params })
	},

	create: (productData: FormData): Promise<ApiResponse<Product>> =>
		api.post("/product", productData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),

	update: (id: string, productData: FormData): Promise<ApiResponse<Product>> =>
		api.patch(`/product/${id}`, productData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),

	delete: (id: string): Promise<ApiResponse<void>> =>
		api.delete(`/product/${id}`),
}

export const categoryAPI = {
	getAll: (params?: {
		page?: number
		limit?: number
		sort?: string
		search?: string
	}): Promise<ApiResponse<Category[]>> => api.get("/category", { params }),

	getById: (id: string): Promise<ApiResponse<Category>> =>
		api.get(`/category/${id}`),

	getBySlug: (slug: string): Promise<ApiResponse<Category>> =>
		api.get(`/category/slug/${slug}`),

	create: (categoryData: any): Promise<ApiResponse<Category>> =>
		api.post("/category", categoryData),

	update: (id: string, categoryData: any): Promise<ApiResponse<Category>> =>
		api.patch(`/category/${id}`, categoryData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),

	delete: (id: string): Promise<ApiResponse<void>> =>
		api.delete(`/category/${id}`),
}

export const authAPI = {
	login: async (body: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
		try {
			const response = await api.post<ApiResponse<LoginResponse>>(
				"/auth/login",
				body,
			)
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(error.response?.data?.message || error.message)
			}
			throw error
		}
	},

	register: async (body: RegisterRequest): Promise<ApiResponse<void>> => {
		try {
			const response = await api.post<ApiResponse<void>>("/auth/register", body)
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(error.response?.data?.message || error.message)
			}
			throw error
		}
	},

	refreshToken: async (): Promise<ApiResponse<RefreshTokenResponse>> => {
		try {
			const response = await api.post<ApiResponse<RefreshTokenResponse>>(
				"/auth/refresh",
			)
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(error.response?.data?.message || error.message)
			}
			throw error
		}
	},
}

async function getFeaturedProducts() {
	try {
		const response = await productAPI.getAll({
			limit: 8,
			sort: "is_featured.desc",
			includeDeleted: false, // Explicitly exclude deleted products
		})
		return response.data || []
	} catch (error) {
		console.error("Error fetching featured products:", error)
		return []
	}
}

async function getNewArrivals() {
	try {
		const response = await productAPI.getAll({
			limit: 8,
			sort: "created_at.desc",
			includeDeleted: false, // Explicitly exclude deleted products
		})
		return response.data || []
	} catch (error) {
		console.error("Error fetching new arrivals:", error)
		return []
	}
}
