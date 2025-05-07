"use client"

import { useEffect, useState, useCallback, lazy, Suspense } from "react"
import { productAPI, categoryAPI } from "@/lib/api"
import type { Product, Category } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from "@/components/layout/header"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash2, Loader2, ArrowUpDown } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

// Lazy-loaded components
const ProductForm = lazy(() => import("@/components/products/product-form"))

const ITEMS_PER_PAGE = 10

export default function ProductPage() {
	const [products, setProducts] = useState<Product[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)
	const [filters, setFilters] = useState({
		search: "",
		category: "",
		minPrice: "",
		maxPrice: "",
		showDeleted: false,
	})
	const [sortConfig, setSortConfig] = useState<{
		key: keyof Product | "category" | null
		direction: "asc" | "desc"
	}>({
		key: null,
		direction: "asc",
	})
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState<Product | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [pagination, setPagination] = useState({
		page: 1,
		limit: ITEMS_PER_PAGE,
		total_page: 1,
		total_data: 0,
	})

	const debouncedSearch = useDebounce(filters.search, 300)
	const debouncedMinPrice = useDebounce(filters.minPrice, 300)
	const debouncedMaxPrice = useDebounce(filters.maxPrice, 300)

	const fetchProducts = useCallback(async () => {
		try {
			setIsLoading(true)
			const response = await productAPI.getAll({
				page: currentPage,
				limit: ITEMS_PER_PAGE,
				includeDeleted: true,
				deletedOnly: filters.showDeleted,
				search: debouncedSearch,
				category_id: filters.category || undefined,
				min_price: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
				max_price: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
			})

			const filteredProducts = filters.showDeleted
				? response.data
				: response.data.filter((product) => !product.is_deleted)

			setProducts(filteredProducts)
			setPagination(
				response.pagination || {
					page: 1,
					limit: ITEMS_PER_PAGE,
					total_page: 1,
					total_data: 0,
				},
			)
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Gagal memuat produk"))
			toast.error("Gagal memuat produk")
		} finally {
			setIsLoading(false)
		}
	}, [
		currentPage,
		filters,
		debouncedSearch,
		debouncedMinPrice,
		debouncedMaxPrice,
	])

	const fetchCategories = useCallback(async () => {
		try {
			const response = await categoryAPI.getAll({
				search: debouncedSearch,
			})
			setCategories(response.data)
		} catch (err) {
			console.error("Error fetching categories:", err)
			setError(err instanceof Error ? err : new Error("Gagal memuat kategori"))
			toast.error("Gagal memuat kategori")
		}
	}, [debouncedSearch])

	useEffect(() => {
		fetchProducts()
		fetchCategories()
	}, [fetchProducts, fetchCategories])

	const handleDelete = useCallback(
		async (id: string) => {
			if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return

			try {
				await productAPI.delete(id)
				toast.success("Produk berhasil dihapus")
				fetchProducts()
			} catch (err) {
				toast.error("Gagal menghapus produk")
				setError(
					err instanceof Error ? err : new Error("Gagal menghapus produk"),
				)
			}
		},
		[fetchProducts],
	)

	const handleDialogOpen = useCallback((item: Product | null) => {
		setSelectedItem(item)
		setIsDialogOpen(true)
	}, [])

	const handleSuccess = useCallback(() => {
		setIsDialogOpen(false)
		fetchProducts()
	}, [fetchProducts])

	const handleFilterChange = useCallback(
		(key: keyof typeof filters, value: string | boolean) => {
			setFilters((prev) => ({ ...prev, [key]: value }))
			setCurrentPage(1)
		},
		[],
	)

	const handleSort = useCallback((key: keyof Product | "category") => {
		setSortConfig((currentSort) => ({
			key,
			direction:
				currentSort.key === key && currentSort.direction === "asc"
					? "desc"
					: "asc",
		}))
	}, [])

	const sortedProducts = useCallback(() => {
		if (!sortConfig.key) return products

		return [...products].sort((a, b) => {
			if (sortConfig.key === "category") {
				const categoryA =
					categories.find((c) => c.id === a.category_id)?.name || ""
				const categoryB =
					categories.find((c) => c.id === b.category_id)?.name || ""
				return sortConfig.direction === "asc"
					? categoryA.localeCompare(categoryB)
					: categoryB.localeCompare(categoryA)
			}

			const aValue = a[sortConfig.key as keyof Product]
			const bValue = b[sortConfig.key as keyof Product]

			if (typeof aValue === "string" && typeof bValue === "string") {
				return sortConfig.direction === "asc"
					? aValue.localeCompare(bValue)
					: bValue.localeCompare(aValue)
			}

			if (typeof aValue === "number" && typeof bValue === "number") {
				return sortConfig.direction === "asc"
					? aValue - bValue
					: bValue - aValue
			}

			return 0
		})
	}, [products, sortConfig, categories])

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center py-12">
					<h2 className="text-2xl font-semibold text-red-600 mb-4">
						Terjadi Kesalahan
					</h2>
					<p className="text-gray-600 mb-6">{error.message}</p>
					<Button onClick={fetchProducts}>Coba Lagi</Button>
				</div>
			</div>
		)
	}

	return (
		<>
			<Header />
			<div className="mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Produk</h1>

				{/* Filters Section */}
				<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
						{/* Search Input */}
						<div className="relative lg:col-span-4">
							<div className="bg-gray-50 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-2">
									<Search className="h-4 w-4 text-gray-500" />
									<Label className="text-sm font-medium">Cari</Label>
								</div>
								<Input
									type="text"
									placeholder="Cari produk..."
									className="w-full bg-white"
									value={filters.search}
									onChange={(e) => handleFilterChange("search", e.target.value)}
								/>
							</div>
						</div>

						{/* Category Filter */}
						<div className="lg:col-span-3">
							<div className="bg-gray-50 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-2">
									<svg
										className="h-4 w-4 text-gray-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
										/>
									</svg>
									<Label className="text-sm font-medium">Kategori</Label>
								</div>
								<select
									className="w-full px-3 py-2 border rounded-md bg-white"
									value={filters.category}
									onChange={(e) =>
										handleFilterChange("category", e.target.value)
									}
								>
									<option value="">Semua Kategori</option>
									{categories.map((category) => (
										<option key={category.id} value={category.id}>
											{category.name}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Price Range */}
						<div className="lg:col-span-3">
							<div className="bg-gray-50 rounded-lg p-4">
								<div className="flex items-center gap-2 mb-2">
									<svg
										className="h-4 w-4 text-gray-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<Label className="text-sm font-medium">Rentang Harga</Label>
								</div>
								<div className="flex gap-2 items-center">
									<Input
										type="number"
										placeholder="Minimal"
										className="w-full bg-white"
										value={filters.minPrice}
										onChange={(e) =>
											handleFilterChange("minPrice", e.target.value)
										}
									/>
									<span className="text-gray-500">-</span>
									<Input
										type="number"
										placeholder="Maksimal"
										className="w-full bg-white"
										value={filters.maxPrice}
										onChange={(e) =>
											handleFilterChange("maxPrice", e.target.value)
										}
									/>
								</div>
							</div>
						</div>

						{/* Show Deleted & Add Button */}
						<div className="lg:col-span-2">
							<div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col justify-between">
								<div className="flex items-center gap-2">
									<Label htmlFor="showDeleted" className="text-sm font-medium">
										Tampilkan Terhapus
									</Label>
									<Switch
										id="showDeleted"
										checked={filters.showDeleted}
										onCheckedChange={(checked) =>
											handleFilterChange("showDeleted", checked)
										}
									/>
								</div>
								<Button
									onClick={() => handleDialogOpen(null)}
									className="w-full mt-4"
								>
									<Plus className="h-4 w-4 mr-2" />
									Tambah Produk
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Products Table */}
				{isLoading ? (
					<div className="space-y-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-16 w-full" />
						))}
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-sm overflow-hidden">
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead
											className="min-w-[200px] cursor-pointer hover:bg-gray-50"
											onClick={() => handleSort("name")}
										>
											<div className="flex items-center gap-2">
												Nama Produk
												<ArrowUpDown className="h-4 w-4" />
											</div>
										</TableHead>
										<TableHead
											className="min-w-[150px] cursor-pointer hover:bg-gray-50"
											onClick={() => handleSort("category")}
										>
											<div className="flex items-center gap-2">
												Kategori
												<ArrowUpDown className="h-4 w-4" />
											</div>
										</TableHead>
										<TableHead
											className="min-w-[100px] cursor-pointer hover:bg-gray-50"
											onClick={() => handleSort("price")}
										>
											<div className="flex items-center gap-2">
												Harga
												<ArrowUpDown className="h-4 w-4" />
											</div>
										</TableHead>
										<TableHead
											className="min-w-[100px] cursor-pointer hover:bg-gray-50"
											onClick={() => handleSort("stock")}
										>
											<div className="flex items-center gap-2">
												Stok
												<ArrowUpDown className="h-4 w-4" />
											</div>
										</TableHead>
										<TableHead
											className="min-w-[100px] cursor-pointer hover:bg-gray-50"
											onClick={() => handleSort("deleted_at")}
										>
											<div className="flex items-center gap-2">
												Status
												<ArrowUpDown className="h-4 w-4" />
											</div>
										</TableHead>
										<TableHead className="text-right min-w-[100px]">
											Aksi
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{sortedProducts().length > 0 ? (
										sortedProducts().map((product) => (
											<TableRow key={product.id}>
												<TableCell className="font-medium">
													{product.name}
												</TableCell>
												<TableCell>
													{categories.find((c) => c.id === product.category_id)
														?.name || "N/A"}
												</TableCell>
												<TableCell>{formatCurrency(product.price)}</TableCell>
												<TableCell>{product.stock}</TableCell>
												<TableCell>
													<span
														className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
															product.deleted_at
																? "bg-red-100 text-red-800"
																: "bg-green-100 text-green-800"
														}`}
													>
														{product.deleted_at ? "Dihapus" : "Aktif"}
													</span>
												</TableCell>
												<TableCell className="text-right space-x-1">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleDialogOpen(product)}
														aria-label="Edit product"
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleDelete(product.id)}
														aria-label="Delete product"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={6} className="text-center py-8">
												Tidak ada produk ditemukan
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				)}

				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogContent className="max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>
								{selectedItem ? "Edit" : "Add New"} Product
							</DialogTitle>
						</DialogHeader>
						<Suspense
							fallback={
								<Loader2 className="h-8 w-8 animate-spin mx-auto my-8" />
							}
						>
							<ProductForm
								product={selectedItem}
								onSuccess={handleSuccess}
								onCancel={() => setIsDialogOpen(false)}
							/>
						</Suspense>
					</DialogContent>
				</Dialog>
			</div>
		</>
	)
}
