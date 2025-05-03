// src/components/products/product-card.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { Product } from "@/types/api"
import { useCart } from "@/hooks/use-cart"
import { motion } from "motion/react"
import { ReactNode } from "react"

interface ProductCardProps {
	product: Product
	badge?: ReactNode
	onError?: (error: Error) => void
}

export default function ProductCard({
	product,
	badge,
	onError,
}: ProductCardProps) {
	const [isHovered, setIsHovered] = useState(false)
	const [imageError, setImageError] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isAddingToCart, setIsAddingToCart] = useState(false)
	const { addItem, isInCart } = useCart()

	const alreadyInCart = isInCart(product.id, undefined)

	// Get primary image or first available image
	const productImage = product.images?.[0] // Simplified to just get first image
	const imageUrl = productImage?.url

	const handleAddToCart = async (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		if (isAddingToCart || alreadyInCart) return

		try {
			setIsAddingToCart(true)
			await addItem(product)
		} catch (error) {
			console.error("Error adding item to cart:", error)
			onError?.(
				error instanceof Error
					? error
					: new Error("Failed to add item to cart"),
			)
		} finally {
			setIsAddingToCart(false)
		}
	}

	const handleImageError = () => {
		setImageError(true)
		setIsLoading(false)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="group relative"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Link
				href={`/product/${product.slug}`}
				className="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
			>
				{badge}
				<div className="aspect-[4/3] w-full bg-gray-100 relative">
					{imageUrl && !imageError ? (
						<>
							<Image
								src={imageUrl}
								alt={product.name}
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								className="object-cover transition-transform group-hover:scale-105"
								priority={false}
								quality={85}
								onLoadingComplete={() => setIsLoading(false)}
								onError={handleImageError}
							/>
							{isLoading && (
								<div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
									<Loader2 className="h-6 w-6 animate-spin text-gray-400" />
								</div>
							)}
						</>
					) : (
						<div className="absolute inset-0 flex items-center justify-center bg-gray-100">
							<span className="text-gray-400">No image available</span>
						</div>
					)}
				</div>
				<div className="p-4">
					<h3 className="font-semibold line-clamp-1">{product.name}</h3>
					<p className="mt-1 text-sm text-gray-600 line-clamp-2">
						{product.description}
					</p>
					<div className="mt-3 flex items-center justify-between">
						<p className="text-lg font-semibold text-primary">
							{formatPrice(product.price)}
						</p>
						{product.stock !== undefined && product.stock <= 5 && (
							<p className="text-sm text-red-500">Sisa {product.stock} unit</p>
						)}
					</div>
				</div>
			</Link>
			<button
				onClick={handleAddToCart}
				disabled={isAddingToCart || alreadyInCart}
				className={`absolute bottom-4 right-4 rounded-full p-2 shadow-lg transition-all ${
					alreadyInCart
						? "bg-green-500 text-white"
						: "bg-white text-gray-700 hover:bg-gray-100"
				} ${isAddingToCart ? "cursor-not-allowed opacity-50" : ""}`}
				aria-label={alreadyInCart ? "Item in cart" : "Add to cart"}
			>
				{isAddingToCart ? (
					<Loader2 className="h-5 w-5 animate-spin" />
				) : alreadyInCart ? (
					<Heart className="h-5 w-5" />
				) : (
					<ShoppingCart className="h-5 w-5" />
				)}
			</button>
		</motion.div>
	)
}
