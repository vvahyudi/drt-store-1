export interface Product {
	id: string
	name: string
	slug: string
	description: string
	price: number
	stock: number
	is_featured: boolean
	is_new?: boolean
	category_id: string
	category?: Category
	images?: ProductImage[]
	details?: Record<string, any>
	variants?: Record<string, any>
	attributes?: Record<string, any>
	created_at: string
	updated_at: string
	deleted_at?: string
}

export interface Category {
	id: string
	name: string
	slug: string
	description: string
	image_url?: string
	created_at: string
	updated_at: string
}

export interface ProductImage {
	id: string
	url: string
	is_primary: boolean
	product_id: string
	created_at: string
	updated_at: string
}

export interface ApiResponse<T> {
	data: T
	message: string
	status: number
}

export interface PaginatedResponse<T> {
	data: T[]
	total: number
	page: number
	limit: number
	total_pages: number
}
