// src/types/api.ts

// Common API response wrapper
export interface ApiResponse<T = any> {
	status: number
	message: string
	data: T
	pagination?: Pagination
	total: number
	page: number
	limit: number
}

export interface Pagination {
	page: number
	limit: number
	total_page: number
	total_data: number
}

// Authentication
export interface LoginRequest {
	username: string
	password: string
}

export interface LoginResponse {
	username: string
	access_token: string
	refresh_token: string
}

export interface RefreshTokenResponse {
	access_token: string
	refresh_token: string
}

export interface RegisterRequest {
	fullname: string
	username: string
	password: string
}

// User
export interface User {
	id: string
	fullname: string
	username: string
	created_at: string
	updated_at: string
}

// Category
export interface Category {
	id: string
	name: string
	slug: string
	description: string
	image_url?: string
	is_deleted?: boolean
	created_at: string
	updated_at?: string
	deleted_at?: string
}

export interface CategoryRequest {
	name: string
	description: string
	image_url?: string
}

// Product
export interface Product {
	id: string
	name: string
	slug: string
	description: string
	price: number
	category_id: string
	category?: Category
	is_new?: boolean
	is_featured?: boolean
	stock?: number
	details?: Record<string, any>
	variants?: Record<string, any>
	attributes?: Record<string, any>
	is_deleted?: boolean
	created_at: string
	updated_at?: string
	deleted_at?: string
	images?: ProductImage[]
}

export interface ProductRequest {
	name: string
	description: string
	price: number
	category_id: string
	is_new?: boolean
	is_featured?: boolean
	stock?: number
	details?: Record<string, any>
	variants?: Record<string, any>
	attributes?: Record<string, any>
	images?: string[] // Base64 encoded images
}

export interface ProductQueryParams {
	page?: number
	limit?: number
	includeDeleted?: boolean
	deletedOnly?: boolean
	sort?: string
	search?: string
	category_id?: string
}

export interface ProductDetails {
	brand?: string
	material?: string
	dimensions?: string
	weight?: string
	[key: string]: any // untuk fleksibilitas tambahan
}

export interface ProductVariant {
	sku: string
	color?: string
	size?: string
	price_modifier?: number // bisa positif/negatif dari harga utama
	stock?: number
}

export interface ProductAttribute {
	key: string
	value: string
}

// Product Image
export interface ProductImage {
	id: string
	product_id: string
	url: string
	cloudinary_id: string
	width?: number
	height?: number
	format?: string
	is_primary: boolean
	created_at: string
	updated_at?: string
}

// Cart Types (frontend only)
export interface CartItem {
	product: Product
	quantity: number
	selected_variants?: Record<string, string>
}

export interface Cart {
	items: CartItem[]
	total: number
}
