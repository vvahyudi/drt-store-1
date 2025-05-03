// src/components/products/product-filters.tsx
"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Category } from "@/types/api"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"

interface ProductFiltersProps {
	categories: Category[]
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
	const router = useRouter()
	const searchParams = useSearchParams()

	const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
	const [expandedSections, setExpandedSections] = useState({
		categories: true,
		price: true,
		sort: true,
	})

	const toggleSection = (section: keyof typeof expandedSections) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}))
	}

	const handleCategoryFilter = (categoryId: string) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set("category", categoryId)
		params.set("page", "1")
		router.push(`/products?${params.toString()}`)
	}

	const handleSortChange = (sortValue: string) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set("sort", sortValue)
		params.set("page", "1")
		router.push(`/products?${params.toString()}`)
	}

	const handlePriceRangeChange = (e: React.FormEvent) => {
		e.preventDefault()
		const params = new URLSearchParams(searchParams.toString())
		params.set("min_price", priceRange[0].toString())
		params.set("max_price", priceRange[1].toString())
		params.set("page", "1")
		router.push(`/products?${params.toString()}`)
	}

	const activeCategory = searchParams.get("category") || ""
	const activeSort = searchParams.get("sort") || "name.asc"

	return (
		<div className="bg-white rounded-lg shadow-sm p-4">
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-bold">Filters</h3>
				<Filter className="h-5 w-5 text-gray-500" />
			</div>

			{/* Categories Filter */}
			<div className="mb-6">
				<div
					className="flex items-center justify-between cursor-pointer mb-2"
					onClick={() => toggleSection("categories")}
				>
					<h4 className="font-medium">Categories</h4>
					{expandedSections.categories ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</div>

				{expandedSections.categories && (
					<div className="space-y-2 mt-2">
						<button
							className={`block w-full text-left px-2 py-1 rounded-md text-sm ${
								activeCategory === ""
									? "bg-primary text-white"
									: "hover:bg-gray-100"
							}`}
							onClick={() => handleCategoryFilter("")}
						>
							All Categories
						</button>

						{categories.map((category) => (
							<button
								key={category.id}
								className={`block w-full text-left px-2 py-1 rounded-md text-sm ${
									activeCategory === category.id
										? "bg-primary text-white"
										: "hover:bg-gray-100"
								}`}
								onClick={() => handleCategoryFilter(category.id)}
							>
								{category.name}
							</button>
						))}
					</div>
				)}
			</div>

			{/* Price Range Filter */}
			<div className="mb-6">
				<div
					className="flex items-center justify-between cursor-pointer mb-2"
					onClick={() => toggleSection("price")}
				>
					<h4 className="font-medium">Price Range</h4>
					{expandedSections.price ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</div>

				{expandedSections.price && (
					<form onSubmit={handlePriceRangeChange} className="mt-2">
						<div className="flex items-center mb-4">
							<input
								type="number"
								min="0"
								value={priceRange[0]}
								onChange={(e) =>
									setPriceRange([Number(e.target.value), priceRange[1]])
								}
								className="w-full p-2 border rounded-md text-sm"
								placeholder="Min"
							/>
							<span className="mx-2">-</span>
							<input
								type="number"
								min="0"
								value={priceRange[1]}
								onChange={(e) =>
									setPriceRange([priceRange[0], Number(e.target.value)])
								}
								className="w-full p-2 border rounded-md text-sm"
								placeholder="Max"
							/>
						</div>

						<button
							type="submit"
							className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
						>
							Apply
						</button>
					</form>
				)}
			</div>

			{/* Sort Options */}
			<div>
				<div
					className="flex items-center justify-between cursor-pointer mb-2"
					onClick={() => toggleSection("sort")}
				>
					<h4 className="font-medium">Sort By</h4>
					{expandedSections.sort ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</div>

				{expandedSections.sort && (
					<div className="space-y-2 mt-2">
						<button
							className={`block w-full text-left px-2 py-1 rounded-md text-sm ${
								activeSort === "name.asc"
									? "bg-primary text-white"
									: "hover:bg-gray-100"
							}`}
							onClick={() => handleSortChange("name.asc")}
						>
							Name: A to Z
						</button>

						<button
							className={`block w-full text-left px-2 py-1 rounded-md text-sm ${
								activeSort === "name.desc"
									? "bg-primary text-white"
									: "hover:bg-gray-100"
							}`}
							onClick={() => handleSortChange("name.desc")}
						>
							Name: Z to A
						</button>

						<button
							className={`block w-full text-left px-2 py-1 rounded-md text-sm ${
								activeSort === "price.asc"
									? "bg-primary text-white"
									: "hover:bg-gray-100"
							}`}
							onClick={() => handleSortChange("price.asc")}
						>
							Price: Low to High
						</button>

						<button
							className={`block w-full text-left px-2 py-1 rounded-md text-sm ${
								activeSort === "price.desc"
									? "bg-primary text-white"
									: "hover:bg-gray-100"
							}`}
							onClick={() => handleSortChange("price.desc")}
						>
							Price: High to Low
						</button>

						<button
							className={`block w-full text-left px-2 py-1 rounded-md text-sm ${
								activeSort === "created_at.desc"
									? "bg-primary text-white"
									: "hover:bg-gray-100"
							}`}
							onClick={() => handleSortChange("created_at.desc")}
						>
							Newest First
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
