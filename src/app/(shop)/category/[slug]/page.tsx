// src/app/(shop)/category/[slug]/page.tsx
import { notFound } from "next/navigation"
import { categoryAPI, productAPI } from "@/lib/api"
import { Category, Product } from "@/types/api"
import ProductCard from "@/components/products/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

interface CategoryPageProps {
	params: {
		slug: string
	}
	searchParams: {
		page?: string
		sort?: string
		search?: string
	}
}

async function getCategory(slug: string): Promise<Category> {
	try {
		const response = await categoryAPI.getBySlug(slug)
		return response.data
	} catch (error) {
		console.error("Error fetching category:", error)
		throw error
	}
}

async function getProducts(
	categoryId: string,
	params: {
		page?: number
		limit?: number
		sort?: string
		search?: string
	},
) {
	try {
		const response = await productAPI.getAll({
			...params,
			category_id: categoryId,
		})
		return {
			data: response.data || [],
			total: response.pagination?.total_data || 0,
			page: response.pagination?.page || 1,
			limit: response.pagination?.limit || 12,
			total_pages: response.pagination?.total_page || 1,
		}
	} catch (error) {
		console.error("Error fetching products:", error)
		return {
			data: [],
			total: 0,
			page: 1,
			limit: 12,
			total_pages: 1,
		}
	}
}

export default async function CategoryPage({
	params,
	searchParams,
}: CategoryPageProps) {
	let category: Category

	try {
		category = await getCategory(params.slug)
	} catch (error) {
		notFound()
	}

	const page = Number(searchParams.page) || 1
	const sort = searchParams.sort
	const search = searchParams.search

	const {
		data: products,
		total,
		total_pages,
	} = await getProducts(category.id, {
		page,
		limit: 12,
		sort,
		search,
	})

	const sortOptions = [
		{ value: "price.asc", label: "Harga Terendah" },
		{ value: "price.desc", label: "Harga Tertinggi" },
		{ value: "created_at.desc", label: "Terbaru" },
	]

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Category Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
				<p className="text-gray-600 mt-2">{category.description}</p>
			</div>

			{/* Search and Sort */}
			<div className="mb-6 flex flex-col md:flex-row gap-4">
				<form className="flex-1">
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

				<Select
					value={sort || ""}
					onValueChange={(value) => {
						const params = new URLSearchParams(window.location.search)
						params.set("sort", value)
						window.location.search = params.toString()
					}}
				>
					<SelectTrigger className="w-full md:w-[200px]">
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
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{products.map((product: Product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			{/* No Products Message */}
			{products.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-600">Tidak ada produk dalam kategori ini.</p>
				</div>
			)}

			{/* Pagination */}
			{total_pages > 1 && (
				<div className="mt-8 flex justify-center gap-2">
					<Button
						variant="outline"
						disabled={page <= 1}
						onClick={() => {
							const params = new URLSearchParams(window.location.search)
							params.set("page", (page - 1).toString())
							window.location.search = params.toString()
						}}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					{Array.from({ length: total_pages }, (_, i) => i + 1).map(
						(pageNum) => (
							<Button
								key={pageNum}
								variant={pageNum === page ? "default" : "outline"}
								onClick={() => {
									const params = new URLSearchParams(window.location.search)
									params.set("page", pageNum.toString())
									window.location.search = params.toString()
								}}
							>
								{pageNum}
							</Button>
						),
					)}
					<Button
						variant="outline"
						disabled={page >= total_pages}
						onClick={() => {
							const params = new URLSearchParams(window.location.search)
							params.set("page", (page + 1).toString())
							window.location.search = params.toString()
						}}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	)
}
