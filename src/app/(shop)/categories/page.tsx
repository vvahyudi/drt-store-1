"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { categoryAPI, productAPI } from "@/lib/api"
import { Category, Product } from "@/types/api"
import ProductCard from "@/components/products/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronRight, Loader2, ChevronDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([])
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null,
	)
	const [products, setProducts] = useState<Product[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isProductsLoading, setIsProductsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery)
		}, 500)

		return () => clearTimeout(timer)
	}, [searchQuery])

	useEffect(() => {
		loadCategories()
	}, [])

	useEffect(() => {
		if (selectedCategory) {
			loadProducts(selectedCategory.id)
		}
	}, [selectedCategory, debouncedSearchQuery])

	const loadCategories = async () => {
		try {
			setIsLoading(true)
			const response = await categoryAPI.getAll()
			setCategories(response.data)
			if (response.data.length > 0) {
				setSelectedCategory(response.data[0])
			}
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Gagal memuat kategori"))
		} finally {
			setIsLoading(false)
		}
	}

	const loadProducts = async (categoryId: string | null, page: number = 1) => {
		try {
			setIsProductsLoading(true)
			const response = categoryId
				? await productAPI.getByCategory(categoryId, {
						search: debouncedSearchQuery || undefined,
						limit: 12,
						page: page,
						sort: "created_at.desc",
				  })
				: await productAPI.getAll({
						search: debouncedSearchQuery || undefined,
						limit: 12,
						page: page,
						sort: "created_at.desc",
				  })
			setProducts(response.data)
			setTotalPages(response.pagination?.total_page || 1)
			setCurrentPage(page)
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Gagal memuat produk"))
		} finally {
			setIsProductsLoading(false)
		}
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value)
	}

	const handleLoadMore = () => {
		if (currentPage < totalPages) {
			loadProducts(selectedCategory!.id, currentPage + 1)
		}
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center py-12">
					<h2 className="text-2xl font-semibold text-red-600 mb-4">
						Terjadi kesalahan
					</h2>
					<p className="text-gray-600 mb-6">{error.message}</p>
					<Button onClick={loadCategories}>Coba Lagi</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Breadcrumb Navigation */}
			<Breadcrumb className="mb-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Beranda</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator>
						<ChevronRight className="h-4 w-4" />
					</BreadcrumbSeparator>
					<BreadcrumbItem>
						<BreadcrumbLink href="/categories">Kategori</BreadcrumbLink>
					</BreadcrumbItem>
					{selectedCategory && (
						<>
							<BreadcrumbSeparator>
								<ChevronRight className="h-4 w-4" />
							</BreadcrumbSeparator>
							<BreadcrumbItem>
								<BreadcrumbLink>{selectedCategory.name}</BreadcrumbLink>
							</BreadcrumbItem>
						</>
					)}
				</BreadcrumbList>
			</Breadcrumb>

			<h1 className="text-3xl font-bold text-gray-900 mb-2">Kategori Produk</h1>
			<p className="text-gray-600 mb-8">Jelajahi produk berdasarkan kategori</p>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* Mobile Category Dropdown */}
				<div className="lg:hidden w-full mb-4">
					<Select
						value={selectedCategory?.id || "all"}
						onValueChange={(value) => {
							if (value === "all") {
								setSelectedCategory(null)
								loadProducts(null)
							} else {
								const category = categories.find((cat) => cat.id === value)
								if (category) setSelectedCategory(category)
							}
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Pilih kategori" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Semua Kategori</SelectItem>
							{categories.map((category) => (
								<SelectItem key={category.id} value={category.id}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Categories Sidebar - Desktop Only */}
				<div className="hidden lg:block w-80 shrink-0">
					<div className="bg-white rounded-lg border p-6 shadow-sm sticky top-4">
						<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<span>Kategori</span>
							<Badge variant="secondary" className="px-2 py-1 text-xs">
								{categories.length}
							</Badge>
						</h2>
						{isLoading ? (
							<div className="space-y-2">
								{[...Array(5)].map((_, i) => (
									<Skeleton key={i} className="h-10 w-full rounded-md" />
								))}
							</div>
						) : (
							<div className="space-y-2">
								<button
									onClick={() => {
										setSelectedCategory(null)
										loadProducts(null)
									}}
									className={`w-full text-left px-4 py-3 rounded-md transition-all flex items-center justify-between ${
										!selectedCategory
											? "bg-primary text-white font-medium"
											: "text-gray-700 hover:bg-gray-50 hover:text-primary"
									}`}
								>
									<span>Semua Kategori</span>
									{!selectedCategory && <ChevronRight className="h-4 w-4" />}
								</button>
								{categories.map((category) => (
									<button
										key={category.id}
										onClick={() => setSelectedCategory(category)}
										className={`w-full text-left px-4 py-3 rounded-md transition-all flex items-center justify-between ${
											selectedCategory?.id === category.id
												? "bg-primary text-white font-medium"
												: "text-gray-700 hover:bg-gray-50 hover:text-primary"
										}`}
									>
										<span>{category.name}</span>
										{selectedCategory?.id === category.id && (
											<ChevronRight className="h-4 w-4" />
										)}
									</button>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Products Section */}
				<div className="flex-1">
					{/* Category Header */}
					<div className="mb-6 bg-white p-6 rounded-lg border shadow-sm">
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
							<div>
								<h2 className="text-2xl font-semibold text-gray-900">
									{selectedCategory ? selectedCategory.name : "Semua Kategori"}
								</h2>
								<p className="text-gray-600 mt-2">
									{selectedCategory
										? selectedCategory.description
										: "Jelajahi semua produk dari berbagai kategori"}
								</p>
							</div>
							<Badge variant="outline" className="self-start md:self-center">
								{products.length} produk
							</Badge>
						</div>
					</div>

					{/* Search Bar */}
					<div className="mb-6">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
							<Input
								type="text"
								placeholder="Cari produk dalam kategori ini..."
								className="w-full pl-10 pr-4 py-2 h-12 rounded-lg"
								value={searchQuery}
								onChange={handleSearchChange}
							/>
							{isProductsLoading && (
								<Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
							)}
						</div>
					</div>

					{/* Products Grid */}
					{isProductsLoading && !products.length ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{[...Array(8)].map((_, i) => (
								<div key={i} className="space-y-4">
									<Skeleton className="h-48 w-full rounded-lg" />
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
								</div>
							))}
						</div>
					) : products.length > 0 ? (
						<>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{products.map((product) => (
									<ProductCard key={product.id} product={product} />
								))}
							</div>
							{products.length >= 12 && currentPage < totalPages && (
								<div className="mt-8 flex justify-center">
									<Button
										variant="outline"
										onClick={handleLoadMore}
										disabled={isProductsLoading}
									>
										{isProductsLoading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Memuat...
											</>
										) : (
											"Muat Lebih Banyak"
										)}
									</Button>
								</div>
							)}
						</>
					) : (
						<div className="text-center py-12 bg-white rounded-lg border shadow-sm">
							<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
								<Search className="h-5 w-5 text-gray-500" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Tidak ada produk ditemukan
							</h3>
							<p className="text-gray-600 mb-4">
								{debouncedSearchQuery
									? "Coba kata kunci pencarian yang berbeda"
									: "Kategori ini masih kosong"}
							</p>
							{debouncedSearchQuery && (
								<Button
									variant="ghost"
									onClick={() => setSearchQuery("")}
									className="text-primary"
								>
									Hapus pencarian
								</Button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
