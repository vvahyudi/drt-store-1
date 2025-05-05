"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
	ShoppingCart,
	Heart,
	Loader2,
	Check,
	MessageCircle,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { Product } from "@/types/api"
import { useCart } from "@/hooks/use-cart"
import { motion } from "motion/react"

interface ProductCardProps {
	product: Product
	badge?: React.ReactNode
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
	const productImage = product.images?.[0]
	const imageUrl = productImage?.url
	const isLowStock = product.stock !== undefined && product.stock <= 5

	const handleAddToCart = async (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		if (isAddingToCart || alreadyInCart) return

		try {
			setIsAddingToCart(true)
			await addItem(product)
		} catch (error) {
			console.error("Gagal menambahkan ke keranjang:", error)
			onError?.(
				error instanceof Error ? error : new Error("Gagal menambahkan produk"),
			)
		} finally {
			setIsAddingToCart(false)
		}
	}
	const storePhone = "628175753345"

	const handleWhatsAppCheckout = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		const message = `Halo, saya tertarik dengan produk:\n\n${
			product.name
		}\nHarga: ${formatPrice(product.price)}\n\nLink produk: ${
			window.location.origin
		}/product/${product.slug}`
		const encodedMessage = encodeURIComponent(message)
		const whatsappUrl = `https://wa.me/${storePhone}?text=${encodedMessage}`

		window.open(whatsappUrl, "_blank")
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
				className="relative block overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-lg"
			>
				{badge}

				{/* Image Container */}
				<div className="aspect-[4/3] w-full bg-gray-50 relative">
					{imageUrl && !imageError ? (
						<>
							<Image
								src={imageUrl}
								alt={product.name}
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								className={`object-cover transition-transform duration-300 ${
									isHovered ? "scale-105" : "scale-100"
								}`}
								priority={false}
								quality={85}
								onLoad={() => setIsLoading(false)}
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
							<span className="text-gray-400">Gambar tidak tersedia</span>
						</div>
					)}
				</div>

				{/* Product Info */}
				<div className="p-4">
					<h3 className="font-semibold text-gray-900 line-clamp-1">
						{product.name}
					</h3>
					<p className="mt-1 text-sm text-gray-600 line-clamp-2 min-h-[40px]">
						{product.description || "Deskripsi tidak tersedia"}
					</p>

					<div className="mt-3 flex items-center justify-between">
						<div>
							<p className="text-lg font-bold text-primary">
								{formatPrice(product.price)}
							</p>
							{isLowStock && (
								<p className="text-xs text-red-500 mt-1">
									Stok hampir habis! Tersisa {product.stock} unit
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Overlay on hover */}
				{isHovered && (
					<div className="absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity">
						<motion.span
							className="text-white font-medium bg-primary/90 px-4 py-2 rounded-full text-sm"
							initial={{ scale: 0.9 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 400, damping: 10 }}
						>
							Lihat Detail
						</motion.span>
					</div>
				)}
			</Link>

			{/* Add to Cart Button */}
			<div className="absolute top-4 right-4 group/cart">
				<motion.button
					onClick={handleAddToCart}
					disabled={isAddingToCart || alreadyInCart}
					className={`rounded-full p-2 shadow-md transition-all ${
						alreadyInCart
							? "bg-green-500 text-white"
							: "bg-white text-gray-700 hover:bg-primary hover:text-white"
					} ${isAddingToCart ? "cursor-not-allowed" : ""}`}
					aria-label={
						alreadyInCart ? "Sudah di keranjang" : "Tambahkan ke keranjang"
					}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
				>
					{isAddingToCart ? (
						<Loader2 className="h-5 w-5 animate-spin" />
					) : alreadyInCart ? (
						<Check className="h-5 w-5" />
					) : (
						<ShoppingCart className="h-5 w-5" />
					)}
				</motion.button>
				{/* Desktop Tooltip */}
				<div className="absolute right-0 top-full mt-2 hidden md:group-hover/cart:block">
					<div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
						{alreadyInCart ? "Sudah di keranjang" : "Tambahkan ke keranjang"}
					</div>
				</div>
			</div>

			{/* WhatsApp Checkout Button */}
			<div className="absolute top-4 right-16 group/whatsapp">
				<motion.button
					onClick={handleWhatsAppCheckout}
					className="rounded-full px-3 py-2 shadow-md transition-all bg-white text-gray-700 hover:bg-green-500 hover:text-white flex items-center gap-2"
					aria-label="Checkout via WhatsApp"
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
				>
					<span className="text-xs font-medium">Checkout via WhatsApp</span>
					<MessageCircle className="h-5 w-5" />
				</motion.button>
				{/* Desktop Tooltip */}
				<div className="absolute right-0 top-full mt-2 hidden md:group-hover/whatsapp:block">
					<div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
						Checkout via WhatsApp
					</div>
				</div>
			</div>

			{/* Wishlist Button */}
			<div className="absolute top-4 left-4 group/wishlist">
				<button
					className="p-2 rounded-full bg-white text-gray-400 hover:text-red-500 transition-colors"
					aria-label="Tambahkan ke wishlist"
				>
					<Heart className="h-5 w-5" />
				</button>
				{/* Desktop Tooltip */}
				<div className="absolute left-0 top-full mt-2 hidden md:group-hover/wishlist:block">
					<div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
						Tambahkan ke wishlist
					</div>
				</div>
			</div>
		</motion.div>
	)
}
