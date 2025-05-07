"use client"

import { useEffect, useState, useCallback, lazy, Suspense } from "react"
import { categoryAPI } from "@/lib/api"
import type { Category } from "@/types/api"
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
import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

// Lazy-loaded components
const CategoryForm = lazy(() => import("@/components/products/category-form"))

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState<Category | null>(null)

	const debouncedSearchQuery = useDebounce(searchQuery, 300)

	const fetchCategories = useCallback(async () => {
		try {
			setIsLoading(true)
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
		} finally {
			setIsLoading(false)
		}
	}, [debouncedSearchQuery])

	useEffect(() => {
		fetchCategories()
	}, [fetchCategories])

	const handleDelete = useCallback(
		async (id: string) => {
			if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return

			try {
				await categoryAPI.delete(id)
				toast.success("Kategori berhasil dihapus")
				fetchCategories()
			} catch (err) {
				toast.error("Gagal menghapus kategori")
				setError(
					err instanceof Error ? err : new Error("Gagal menghapus kategori"),
				)
			}
		},
		[fetchCategories],
	)

	const handleDialogOpen = useCallback((item: Category | null) => {
		setSelectedItem(item)
		setIsDialogOpen(true)
	}, [])

	const handleSuccess = useCallback(() => {
		setIsDialogOpen(false)
		fetchCategories()
	}, [fetchCategories])

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center py-12">
					<h2 className="text-2xl font-semibold text-red-600 mb-4">
						Terjadi Kesalahan
					</h2>
					<p className="text-gray-600 mb-6">{error.message}</p>
					<Button onClick={fetchCategories}>Coba Lagi</Button>
				</div>
			</div>
		)
	}

	return (
		<>
			<Header />
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Kategori</h1>

				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
						<div className="relative w-full sm:w-72">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
							<Input
								type="text"
								placeholder="Cari kategori..."
								className="pl-10"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<Button
							onClick={() => handleDialogOpen(null)}
							className="w-full sm:w-auto"
						>
							<Plus className="h-4 w-4 mr-2" />
							Tambah Kategori
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
									<TableHead>Nama</TableHead>
									<TableHead className="hidden md:table-cell">
										Deskripsi
									</TableHead>
									<TableHead className="text-right">Aksi</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{categories.length > 0 ? (
									categories.map((category) => (
										<TableRow key={category.id}>
											<TableCell className="font-medium">
												{category.name}
											</TableCell>
											<TableCell className="hidden md:table-cell">
												{category.description || "Tidak ada deskripsi"}
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
											Tidak ada kategori ditemukan
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
								{selectedItem ? "Edit" : "Tambah"} Kategori
							</DialogTitle>
						</DialogHeader>
						<Suspense
							fallback={
								<Loader2 className="h-8 w-8 animate-spin mx-auto my-8" />
							}
						>
							<CategoryForm
								category={selectedItem}
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
