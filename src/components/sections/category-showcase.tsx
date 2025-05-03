// src/components/sections/category-showcase.tsx
import { Category } from "@/types/api"
import CategoryCard from "../ui/category-card"
import { ArrowRight } from "lucide-react"

interface CategoryShowcaseProps {
	categories: Category[]
	title?: string
	description?: string
	limit?: number
	viewAllUrl?: string
	layoutMode?: "grid" | "list"
}

export default function CategoryShowcase({
	categories,
	title = "Kategori Unggulan",
	description = "Temukan produk berdasarkan kategori kebutuhan Anda",
	limit = 4,
	viewAllUrl,
	layoutMode = "grid",
}: CategoryShowcaseProps) {
	// Limit the number of categories to display
	const displayCategories = categories.slice(0, limit)

	return (
		<section className="py-12 bg-white">
			<div className="container px-4 mx-auto">
				<div className="text-center mb-8">
					<h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
					{description && <p className="text-gray-600 mt-2">{description}</p>}
				</div>

				<div
					className={`grid grid-cols-1 ${
						layoutMode === "grid"
							? "sm:grid-cols-2 md:grid-cols-4"
							: "md:grid-cols-2"
					} gap-6`}
				>
					{displayCategories.map((category) => (
						<CategoryCard
							key={category.id}
							category={category}
							layoutMode={layoutMode}
						/>
					))}
				</div>

				{viewAllUrl && (
					<div className="text-center mt-8">
						<a
							href={viewAllUrl}
							className="inline-flex items-center text-primary font-medium hover:underline"
						>
							Lihat Semua Kategori
							<ArrowRight className="ml-1 h-4 w-4" />
						</a>
					</div>
				)}
			</div>
		</section>
	)
}
