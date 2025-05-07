"use client"

import { useEffect, useState } from "react"
import { productAPI, categoryAPI } from "@/lib/api"
import type { Product, Category } from "@/types/api"
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Tag, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import Link from "next/link"

export default function DashboardPage() {
	const [products, setProducts] = useState<Product[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)
	const [stats, setStats] = useState({
		totalProducts: 0,
		totalCategories: 0,
		totalValue: 0,
		lowStockItems: 0,
	})

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true)
				const [productsResponse, categoriesResponse] = await Promise.all([
					productAPI.getAll({ limit: 1000 }),
					categoryAPI.getAll({}),
				])

				setProducts(productsResponse.data)
				setCategories(categoriesResponse.data)

				// Calculate stats
				const totalValue = productsResponse.data.reduce(
					(sum, product) => sum + product.price * (product.stock || 0),
					0,
				)
				const lowStockItems = productsResponse.data.filter(
					(product) => (product.stock || 0) < 10,
				).length

				setStats({
					totalProducts: productsResponse.data.length,
					totalCategories: categoriesResponse.data.length,
					totalValue,
					lowStockItems,
				})
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error("Failed to load dashboard data"),
				)
				toast.error("Failed to load dashboard data")
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [])

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center py-12">
					<h2 className="text-2xl font-semibold text-red-600 mb-4">
						Terjadi Kesalahan
					</h2>
					<p className="text-gray-600 mb-6">{error.message}</p>
					<Button onClick={() => window.location.reload()}>Coba Lagi</Button>
				</div>
			</div>
		)
	}

	return (
		<>
			<Header />
			<div className="container mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Dasbor</h1>
					<div className="flex gap-4">
						<Button asChild>
							<Link href="/admin/products">
								<Package className="h-4 w-4 mr-2" />
								Kelola Produk
							</Link>
						</Button>
						<Button asChild variant="outline">
							<Link href="/admin/categories">
								<Tag className="h-4 w-4 mr-2" />
								Kelola Kategori
							</Link>
						</Button>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{isLoading ? (
						<>
							<Skeleton className="h-32" />
							<Skeleton className="h-32" />
							<Skeleton className="h-32" />
							<Skeleton className="h-32" />
						</>
					) : (
						<>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Produk
									</CardTitle>
									<Package className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{stats.totalProducts}
									</div>
									<p className="text-xs text-muted-foreground">
										Produk aktif dalam inventori
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Kategori
									</CardTitle>
									<Tag className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{stats.totalCategories}
									</div>
									<p className="text-xs text-muted-foreground">
										Kategori produk
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Nilai Inventori
									</CardTitle>
									<ArrowUpRight className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{formatCurrency(stats.totalValue)}
									</div>
									<p className="text-xs text-muted-foreground">
										Total nilai inventori
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Stok Menipis
									</CardTitle>
									<ArrowDownRight className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										{stats.lowStockItems}
									</div>
									<p className="text-xs text-muted-foreground">
										Item dengan stok di bawah 10
									</p>
								</CardContent>
							</Card>
						</>
					)}
				</div>

				<div className="mt-8 grid gap-4 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Produk Terbaru</CardTitle>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="space-y-4">
									<Skeleton className="h-12" />
									<Skeleton className="h-12" />
									<Skeleton className="h-12" />
								</div>
							) : (
								<div className="space-y-4">
									{products.slice(0, 5).map((product) => (
										<div
											key={product.id}
											className="flex items-center justify-between"
										>
											<div>
												<p className="font-medium">{product.name}</p>
												<p className="text-sm text-muted-foreground">
													{formatCurrency(product.price)} • Stok:{" "}
													{product.stock}
												</p>
											</div>
											<Button variant="ghost" size="sm" asChild>
												<Link href={`/admin/products?edit=${product.id}`}>
													View
												</Link>
											</Button>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Ringkasan Kategori</CardTitle>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="space-y-4">
									<Skeleton className="h-12" />
									<Skeleton className="h-12" />
									<Skeleton className="h-12" />
								</div>
							) : (
								<div className="space-y-4">
									{categories.slice(0, 5).map((category) => (
										<div
											key={category.id}
											className="flex items-center justify-between"
										>
											<div>
												<p className="font-medium">{category.name}</p>
												<p className="text-sm text-muted-foreground">
													{
														products.filter(
															(p) => p.category_id === category.id,
														).length
													}{" "}
													produk
												</p>
											</div>
											<Button variant="ghost" size="sm" asChild>
												<Link href={`/admin/categories?edit=${category.id}`}>
													View
												</Link>
											</Button>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	)
}
