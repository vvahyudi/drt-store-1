"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Product } from "@/types/api"
import ProductCard from "@/components/products/product-card"

interface ProductCarouselProps {
	products: Product[]
	title: string
	description?: string
	viewAllUrl: string
	bgColor?: string
}

export default function ProductCarousel({
	products,
	title,
	description,
	viewAllUrl,
	bgColor = "bg-gray-50",
}: ProductCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isAnimating, setIsAnimating] = useState(false)
	const itemsPerPage = 4
	const totalPages = Math.ceil(products.length / itemsPerPage)

	// Auto-play functionality
	useEffect(() => {
		const interval = setInterval(() => {
			if (!isAnimating) {
				nextSlide()
			}
		}, 5000) // Change slide every 5 seconds

		return () => clearInterval(interval)
	}, [currentIndex, isAnimating])

	const nextSlide = () => {
		if (isAnimating) return
		setIsAnimating(true)
		setCurrentIndex((prevIndex) =>
			prevIndex + 1 >= totalPages ? 0 : prevIndex + 1,
		)
		setTimeout(() => setIsAnimating(false), 500) // Match transition duration
	}

	const prevSlide = () => {
		if (isAnimating) return
		setIsAnimating(true)
		setCurrentIndex((prevIndex) =>
			prevIndex - 1 < 0 ? totalPages - 1 : prevIndex - 1,
		)
		setTimeout(() => setIsAnimating(false), 500) // Match transition duration
	}

	const goToSlide = (index: number) => {
		if (isAnimating || index === currentIndex) return
		setIsAnimating(true)
		setCurrentIndex(index)
		setTimeout(() => setIsAnimating(false), 500) // Match transition duration
	}

	const visibleProducts = products.slice(
		currentIndex * itemsPerPage,
		(currentIndex + 1) * itemsPerPage,
	)

	return (
		<section className={`py-12 ${bgColor}`}>
			<div className="container px-4 mx-auto">
				<div className="flex justify-between items-center mb-8">
					<div>
						<h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
						{description && <p className="text-gray-600 mt-1">{description}</p>}
					</div>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<button
								onClick={prevSlide}
								className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								aria-label="Previous slide"
								disabled={isAnimating}
							>
								<ChevronLeft className="h-5 w-5" />
							</button>
							<button
								onClick={nextSlide}
								className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								aria-label="Next slide"
								disabled={isAnimating}
							>
								<ChevronRight className="h-5 w-5" />
							</button>
						</div>
						<a
							href={viewAllUrl}
							className="text-primary inline-flex items-center hover:underline font-medium"
						>
							Lihat Semua
							<ChevronRight className="ml-1 h-4 w-4" />
						</a>
					</div>
				</div>

				<div className="relative overflow-hidden">
					<div
						className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 transition-transform duration-500 ease-in-out"
						style={{
							transform: `translateX(-${currentIndex * 100}%)`,
						}}
					>
						{products.map((product) => (
							<div
								key={product.id}
								className="w-full transition-all duration-500 ease-in-out"
							>
								<ProductCard product={product} />
							</div>
						))}
					</div>

					{/* Pagination Dots */}
					{totalPages > 1 && (
						<div className="flex justify-center mt-6 gap-2">
							{Array.from({ length: totalPages }).map((_, index) => (
								<button
									key={index}
									onClick={() => goToSlide(index)}
									className={`w-2 h-2 rounded-full transition-colors ${
										index === currentIndex
											? "bg-primary w-4"
											: "bg-gray-300 hover:bg-gray-400"
									}`}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
