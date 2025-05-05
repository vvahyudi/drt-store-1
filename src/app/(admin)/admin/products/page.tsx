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
import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react"
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
	const [searchQuery, setSearchQuery] = useState("")
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState<Product | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [pagination, setPagination] = useState({
		page: 1,
		limit: ITEMS_PER_PAGE,
		total_page: 1,
		total_data: 0,
	})
	const [showDeleted, setShowDeleted] = useState(false)

	const debouncedSearchQuery = useDebounce(searchQuery, 300)

	const fetchProducts = useCallback(async () => {
		try {
			setIsLoading(true)
			const response = await productAPI.getAll({
				page: currentPage,
				limit: ITEMS_PER_PAGE,
				includeDeleted: showDeleted,
				deletedOnly: false,
				search: debouncedSearchQuery,
			})
			setProducts(response.data)
			setPagination(
				response.pagination || {
					page: 1,
					limit: ITEMS_PER_PAGE,
					total_page: 1,
					total_data: 0,
				},
			)
		} catch (err) {
			setError(
				err instanceof Error ? err : new Error("Failed to load products"),
			)
			toast.error("Failed to load products")
		} finally {
			setIsLoading(false)
		}
	}, [currentPage, showDeleted, debouncedSearchQuery])

	const fetchCategories = useCallback(async () => {
		try {
			const response = await categoryAPI.getAll({
				search: debouncedSearchQuery,
			})
			setCategories(response.data)
		} catch (err) {
			console.error("Error fetching categories:", err)
			setError(
				err instanceof Error ? err : new Error("Failed to load categories"),
			)
			toast.error("Failed to load categories")
		}
	}, [debouncedSearchQuery])

	useEffect(() => {
		fetchProducts()
		fetchCategories()
	}, [fetchProducts, fetchCategories])

	const handleDelete = useCallback(
		async (id: string) => {
			if (!confirm("Are you sure you want to delete this product?")) return

			try {
				await productAPI.delete(id)
				toast.success("Product deleted successfully")
				fetchProducts()
			} catch (err) {
				toast.error("Failed to delete product")
				setError(
					err instanceof Error ? err : new Error("Failed to delete product"),
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

	const handleShowDeletedChange = useCallback((checked: boolean) => {
		setShowDeleted(checked)
		setCurrentPage(1)
	}, [])

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center py-12">
					<h2 className="text-2xl font-semibold text-red-600 mb-4">
						Something went wrong
					</h2>
					<p className="text-gray-600 mb-6">{error.message}</p>
					<Button onClick={fetchProducts}>Try Again</Button>
				</div>
			</div>
		)
	}

	return (
		<>
			<Header />
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>

				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
						<div className="relative w-full sm:w-72">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
							<Input
								type="text"
								placeholder="Search products..."
								className="pl-10"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<div className="flex items-center gap-2">
							<Label htmlFor="showDeleted">Show Deleted</Label>
							<Switch
								id="showDeleted"
								checked={showDeleted}
								onCheckedChange={handleShowDeletedChange}
							/>
						</div>

						<Button
							onClick={() => handleDialogOpen(null)}
							className="w-full sm:w-auto"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Product
						</Button>
					</div>
				</div>

				{isLoading ? (
					<div className="space-y-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-16 w-full" />
						))}
					</div>
				) : (
					<div className="rounded-lg border overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead className="hidden sm:table-cell">
										Category
									</TableHead>
									<TableHead>Price</TableHead>
									<TableHead className="hidden md:table-cell">Stock</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{products.length > 0 ? (
									products.map((product) => (
										<TableRow key={product.id}>
											<TableCell className="font-medium">
												{product.name}
											</TableCell>
											<TableCell className="hidden sm:table-cell">
												{categories.find((c) => c.id === product.category_id)
													?.name || "N/A"}
											</TableCell>
											<TableCell>{formatCurrency(product.price)}</TableCell>
											<TableCell className="hidden md:table-cell">
												{product.stock}
											</TableCell>
											<TableCell>
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
														product.deleted_at
															? "bg-red-100 text-red-800"
															: "bg-green-100 text-green-800"
													}`}
												>
													{product.deleted_at ? "Deleted" : "Active"}
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
											No products found
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
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
