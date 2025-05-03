"use client"

import {
	useEffect,
	useState,
	useMemo,
	useCallback,
	lazy,
	Suspense,
} from "react"
import { productAPI, categoryAPI } from "@/lib/api"
import type { Product, Category } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
	DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

// Lazy-loaded components
const ProductForm = lazy(() => import("@/components/products/product-form"))
const CategoryForm = lazy(() => import("@/components/products/category-form"))

const ITEMS_PER_PAGE = 10

export default function DashboardPage() {
	const [activeTab, setActiveTab] = useState<"products" | "categories">(
		"products",
	)
	const [products, setProducts] = useState<Product[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingCategories, setIsLoadingCategories] = useState(true)
	const [error, setError] = useState<Error | null>(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState<Product | Category | null>(
		null,
	)
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
			setIsLoadingCategories(true)
			const response = await categoryAPI.getAll({
				search: debouncedSearchQuery,
			})
			console.log("Categories response:", response)
			setCategories(response.data)
		} catch (err) {
			console.error("Error fetching categories:", err)
			setError(
				err instanceof Error ? err : new Error("Failed to load categories"),
			)
			toast.error("Failed to load categories")
		} finally {
			setIsLoadingCategories(false)
		}
	}, [debouncedSearchQuery])

	useEffect(() => {
		if (activeTab === "products") {
			fetchProducts()
		} else {
			fetchCategories()
		}
	}, [activeTab, fetchProducts, fetchCategories])

	const handleDelete = useCallback(
		async (id: string) => {
			if (!confirm("Are you sure you want to delete this item?")) return

			try {
				if (activeTab === "products") {
					await productAPI.delete(id)
					toast.success("Product deleted successfully")
				} else {
					await categoryAPI.delete(id)
					toast.success("Category deleted successfully")
				}
				if (activeTab === "products") {
					fetchProducts()
				} else {
					fetchCategories()
				}
			} catch (err) {
				toast.error("Failed to delete item")
				setError(
					err instanceof Error ? err : new Error("Failed to delete item"),
				)
			}
		},
		[activeTab, fetchProducts, fetchCategories],
	)

	const handleDialogOpen = useCallback((item: Product | Category | null) => {
		setSelectedItem(item)
		setIsDialogOpen(true)
	}, [])

	const handleSuccess = useCallback(() => {
		setIsDialogOpen(false)
		if (activeTab === "products") {
			fetchProducts()
		} else {
			fetchCategories()
		}
	}, [activeTab, fetchProducts, fetchCategories])

	const filteredItems = useMemo(() => {
		if (activeTab === "products") {
			return products.filter(
				(product) =>
					product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					product.description.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		}
		return categories.filter(
			(category) =>
				category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				category.description.toLowerCase().includes(searchQuery.toLowerCase()),
		)
	}, [activeTab, products, categories, searchQuery])

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center py-12">
					<h2 className="text-2xl font-semibold text-red-600 mb-4">
						Something went wrong
					</h2>
					<p className="text-gray-600 mb-6">{error.message}</p>
					<Button
						onClick={activeTab === "products" ? fetchProducts : fetchCategories}
					>
						Try Again
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

			<Tabs
				value={activeTab}
				onValueChange={(value) =>
					setActiveTab(value as "products" | "categories")
				}
			>
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<TabsList>
						<TabsTrigger value="products">Products</TabsTrigger>
						<TabsTrigger value="categories">Categories</TabsTrigger>
					</TabsList>

					<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
						<div className="relative w-full sm:w-72">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
							<Input
								type="text"
								placeholder={`Search ${activeTab}...`}
								className="pl-10"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						{activeTab === "products" && (
							<div className="flex items-center gap-2">
								<Label htmlFor="showDeleted">Show Deleted</Label>
								<Switch
									id="showDeleted"
									checked={showDeleted}
									onCheckedChange={setShowDeleted}
								/>
							</div>
						)}

						<Button
							onClick={() => handleDialogOpen(null)}
							className="w-full sm:w-auto"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add {activeTab === "products" ? "Product" : "Category"}
						</Button>
					</div>
				</div>

				<TabsContent value="products">
					{isLoading ? (
						<div className="space-y-4">
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={i} className="h-16 w-full" />
							))}
						</div>
					) : (
						<>
							<div className="rounded-lg border overflow-hidden">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead className="hidden sm:table-cell">
												Category
											</TableHead>
											<TableHead>Price</TableHead>
											<TableHead className="hidden md:table-cell">
												Stock
											</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredItems.length > 0 ? (
											(filteredItems as Product[]).map((product) => (
												<TableRow key={product.id}>
													<TableCell className="font-medium">
														{product.name}
													</TableCell>
													<TableCell className="hidden sm:table-cell">
														{categories.find(
															(c) => c.id === product.category_id,
														)?.name || "N/A"}
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

							{pagination.total_page > 1 && (
								<div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
									<div className="text-sm text-gray-500">
										Showing {products.length} of {pagination.total_data}{" "}
										products
									</div>
									<div className="flex gap-2">
										<Button
											variant="outline"
											onClick={() =>
												setCurrentPage((prev) => Math.max(prev - 1, 1))
											}
											disabled={currentPage === 1}
										>
											Previous
										</Button>
										<div className="flex items-center px-4">
											Page {currentPage} of {pagination.total_page}
										</div>
										<Button
											variant="outline"
											onClick={() =>
												setCurrentPage((prev) =>
													Math.min(prev + 1, pagination.total_page),
												)
											}
											disabled={currentPage === pagination.total_page}
										>
											Next
										</Button>
									</div>
								</div>
							)}
						</>
					)}
				</TabsContent>

				<TabsContent value="categories">
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
										<TableHead className="hidden md:table-cell">
											Description
										</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredItems.length > 0 ? (
										(filteredItems as Category[]).map((category) => (
											<TableRow key={category.id}>
												<TableCell className="font-medium">
													{category.name}
												</TableCell>
												<TableCell className="hidden md:table-cell">
													{category.description || "No description"}
												</TableCell>
												<TableCell className="text-right space-x-1">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleDialogOpen(category)}
														aria-label="Edit category"
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleDelete(category.id)}
														aria-label="Delete category"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={3} className="text-center py-8">
												No categories found
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					)}
				</TabsContent>
			</Tabs>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{selectedItem ? "Edit" : "Add New"} {activeTab.slice(0, -1)}
						</DialogTitle>
					</DialogHeader>
					<Suspense
						fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto my-8" />}
					>
						{activeTab === "products" ? (
							<ProductForm
								product={selectedItem as Product | null}
								categories={categories}
								onSuccess={handleSuccess}
								onCancel={() => setIsDialogOpen(false)}
							/>
						) : (
							<CategoryForm
								category={selectedItem as Category | null}
								onSuccess={handleSuccess}
								onCancel={() => setIsDialogOpen(false)}
							/>
						)}
					</Suspense>
				</DialogContent>
			</Dialog>
		</div>
	)
}
