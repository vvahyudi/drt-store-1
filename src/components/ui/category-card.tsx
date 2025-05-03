// src/components/ui/category-card.tsx
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import ImageFallback from "./image-fallback"
import { Category } from "@/types/api"

interface CategoryCardProps {
	category: Category
	layoutMode?: "grid" | "list"
}

export default function CategoryCard({
	category,
	layoutMode = "grid",
}: CategoryCardProps) {
	return (
		<Link href={`/category/${category.slug}`} className="group block">
			<div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform group-hover:shadow-md group-hover:-translate-y-1 border h-full">
				{layoutMode === "grid" && (
					<div className="relative h-40">
						{category.image_url ? (
							<ImageFallback
								src={category.image_url}
								alt={category.name}
								fill
								className="object-cover"
								fallbackComponent={
									<div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center">
										<span className="text-primary font-medium text-lg">
											{category.name}
										</span>
									</div>
								}
							/>
						) : (
							<div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center">
								<span className="text-primary font-medium text-lg">
									{category.name}
								</span>
							</div>
						)}
						<div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
					</div>
				)}

				<div className="p-4">
					<h3 className="font-medium text-lg group-hover:text-primary transition-colors">
						{category.name}
					</h3>
					<p className="text-sm text-gray-600 mt-1 line-clamp-2">
						{category.description}
					</p>
					<div className="mt-3 flex items-center text-primary text-sm font-medium">
						<span>Lihat Produk</span>
						<ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
					</div>
				</div>
			</div>
		</Link>
	)
}
