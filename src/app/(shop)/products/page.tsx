"use client"

export const dynamic = "force-dynamic"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
	ShoppingBag,
	ArrowRight,
	Filter,
	Search,
	SlidersHorizontal,
	ChevronLeft,
	ChevronRight,
} from "lucide-react"
import { productAPI, categoryAPI } from "@/lib/api"
import ProductCard from "@/components/products/product-card"
import { Product, Category } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Suspense, useEffect, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Badge } from "@/components/ui/badge"

async function getProducts(params: {
	page?: number
	limit?: number
	sort?: string
	search?: string
	category_id?: string
}) {
	try {
		let response
		if (params.category_id) {
			response = await productAPI.getByCategory(params.category_id, {
				page: params.page,
				limit: params.limit,
				sort: params.sort,
				search: params.search,
			})
		} else {
			response = await productAPI.getAll({
				...params,
				category_id: undefined,
			})
		}

		if (!response.data) {
			throw new Error("No products data received")
		}

		return {
			data: response.data,
			total: response.pagination?.total_data || 0,
			page: response.pagination?.page || 1,
			limit: response.pagination?.limit || 12,
			total_pages: response.pagination?.total_page || 1,
		}
	} catch (error) {
		console.error("Error fetching products:", error)
		throw new Error("Failed to fetch products")
	}
}

async function getCategories() {
	try {
		const response = await categoryAPI.getAll()
		return response.data || []
	} catch (error) {
		console.error("Error fetching categories:", error)
		throw new Error("Failed to fetch categories")
	}
}

function ProductsGrid({ products }: { products: Product[] }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{products.map((product: Product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	)
}

function ProductsError({ error }: { error: Error }) {
	return (
		<div className="text-center py-12">
			<h2 className="text-2xl font-semibold text-red-600 mb-4">
				Something went wrong
			</h2>
			<p className="text-gray-600">{error.message}</p>
		</div>
	)
}

// This component handles search params
function ProductsContent() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [isLoading, setIsLoading] = useState(true)
	const [products, setProducts] = useState<Product[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [error, setError] = useState<Error | null>(null)
	const [totalPages, setTotalPages] = useState(1)

	const page = Number(searchParams.get("page")) || 1
	const sort = searchParams.get("sort")
	const category_id = searchParams.get("category_id")
	const search = searchParams.get("search")

	useEffect(() => {
		async function loadData() {
			try {
				setIsLoading(true)
				setError(null)

				const [productsResponse, categoriesData] = await Promise.all([
					getProducts({
						page,
						limit: 12,
						sort: sort || undefined,
						search: search || undefined,
						category_id: category_id || undefined,
					}),
					getCategories(),
				])

				setProducts(productsResponse.data)
				setCategories(categoriesData)
				setTotalPages(productsResponse.total_pages)
			} catch (err) {
				setError(err instanceof Error ? err : new Error("Failed to load data"))
			} finally {
				setIsLoading(false)
			}
		}

		loadData()
	}, [page, sort, category_id, search])

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const searchQuery = formData.get("search") as string

		const params = new URLSearchParams()
		if (searchQuery) params.set("search", searchQuery)
		if (sort) params.set("sort", sort)
		if (category_id) params.set("category_id", category_id)

		router.push(`/products?${params.toString()}`)
	}

	const handleSort = (value: string) => {
		const params = new URLSearchParams()
		params.set("sort", value)
		if (category_id) params.set("category_id", category_id)
		if (search) params.set("search", search)

		router.push(`/products?${params.toString()}`)
	}

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams()
		params.set("page", newPage.toString())
		if (sort) params.set("sort", sort)
		if (category_id) params.set("category_id", category_id)
		if (search) params.set("search", search)

		router.push(`/products?${params.toString()}`)
	}

	const handleCategoryClick = (selectedCategoryId?: string) => {
		const params = new URLSearchParams()
		if (selectedCategoryId) params.set("category_id", selectedCategoryId)
		if (search) params.set("search", search)
		if (sort) params.set("sort", sort)
		router.push(`/products?${params.toString()}`)
	}

	const sortOptions = [
		{ value: "price.asc", label: "Harga Terendah" },
		{ value: "price.desc", label: "Harga Tertinggi" },
		{ value: "created_at.desc", label: "Terbaru" },
	]

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center py-12">
					<h2 className="text-2xl font-semibold text-red-600 mb-4">
						Something went wrong
					</h2>
					<p className="text-gray-600">{error.message}</p>
				</div>
			</div>
		)
	}

	return (
		<div className=" mx-auto px-4 py-8">
			{/* Mobile Filters Button */}
			<div className="md:hidden mb-4">
				<Button variant="outline" className="w-full">
					<Filter className="mr-2 h-4 w-4" />
					Filter Produk
				</Button>
			</div>

			<div className="flex flex-col md:flex-row gap-8">
				{/* Sidebar Filters - Desktop */}
				<div className="hidden md:block w-72 space-y-6">
					{/* Categories Filter */}
					<div className="bg-white rounded-lg border p-6 shadow-sm">
						<h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
							<span>Kategori</span>
							<Badge variant="secondary" className="px-2 py-1 text-xs">
								{categories.length}
							</Badge>
						</h2>

						<div className="space-y-2">
							<button
								onClick={() => handleCategoryClick()}
								className={`w-full text-left px-4 py-3 rounded-md transition-all flex items-center justify-between ${
									!category_id
										? "bg-primary text-white font-bold"
										: "text-gray-700 hover:bg-gray-50 hover:text-primary"
								}`}
							>
								<span>Semua Kategori</span>
								{!category_id && <ChevronRight className="h-4 w-4" />}
							</button>
							{categories.map((cat: Category) => (
								<button
									key={cat.id}
									onClick={() => handleCategoryClick(cat.id)}
									className={`w-full text-left px-4 py-3 rounded-md transition-all flex items-center justify-between ${
										category_id === String(cat.id)
											? "bg-primary text-white font-bold"
											: "text-gray-700 hover:bg-gray-50 hover:text-primary"
									}`}
								>
									<span>{cat.name}</span>
									{category_id === String(cat.id) && (
										<ChevronRight className="h-4 w-4" />
									)}
								</button>
							))}
						</div>
					</div>

					{/* Sort Options */}
					<div className="bg-white rounded-lg border p-6 shadow-sm">
						<h2 className="text-lg font-semibold mb-4 text-gray-800">
							Urutkan
						</h2>
						<div className="space-y-2">
							{sortOptions.map((option) => (
								<button
									key={option.value}
									onClick={() => handleSort(option.value)}
									className={`w-full text-left px-4 py-3 rounded-md transition-colors font-medium ${
										sort === option.value
											? "bg-primary text-white hover:bg-primary/90"
											: "text-gray-700 hover:bg-gray-100"
									}`}
								>
									{option.label}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex-1">
					{/* Search Bar */}
					<form
						onSubmit={handleSearch}
						className="bg-white rounded-lg border p-4 mb-6 shadow-sm"
					>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
							<Input
								name="search"
								type="text"
								placeholder="Cari produk..."
								className="w-full pl-10 pr-4 py-2"
								defaultValue={search || ""}
							/>
						</div>
					</form>

					{/* Mobile Sort Dropdown */}
					<div className="md:hidden mb-6">
						<Select value={sort || ""} onValueChange={handleSort}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Urutkan" />
							</SelectTrigger>
							<SelectContent>
								{sortOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Products Grid */}
					<ErrorBoundary FallbackComponent={ProductsError}>
						<Suspense fallback={<div>Loading products...</div>}>
							{isLoading ? (
								<div className="text-center py-12">
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
									<p className="mt-4 text-gray-600">Loading products...</p>
								</div>
							) : products.length > 0 ? (
								<ProductsGrid products={products} />
							) : (
								<div className="text-center py-12">
									<h2 className="text-2xl font-semibold text-gray-900 mb-4">
										Tidak ada produk ditemukan
									</h2>
									<p className="text-gray-600">
										Coba ubah filter atau kata kunci pencarian Anda
									</p>
								</div>
							)}
						</Suspense>
					</ErrorBoundary>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="mt-8 flex justify-center gap-2">
							<Button
								variant="outline"
								disabled={page <= 1}
								onClick={() => handlePageChange(page - 1)}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							{Array.from({ length: totalPages }, (_, i) => i + 1).map(
								(pageNum) => (
									<Button
										key={pageNum}
										variant={pageNum === page ? "default" : "outline"}
										onClick={() => handlePageChange(pageNum)}
									>
										{pageNum}
									</Button>
								),
							)}
							<Button
								variant="outline"
								disabled={page >= totalPages}
								onClick={() => handlePageChange(page + 1)}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

// Main component with Suspense boundary
export default function ProductsPage() {
	return (
		<Suspense
			fallback={
				<div className="container mx-auto px-4 py-8 text-center">
					Loading...
				</div>
			}
		>
			<ProductsContent />
		</Suspense>
	)
}
