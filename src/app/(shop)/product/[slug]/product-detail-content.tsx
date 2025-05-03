// src/app/(shop)/product/[slug]/product-detail-content.tsx
"use client"

import { useState, Dispatch, SetStateAction } from "react"
import { Product } from "@/types/api"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import {
	ShoppingCart,
	Check,
	ArrowRight,
	Share2,
	Heart,
	Package,
	Truck,
	RefreshCw,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useWhatsappCheckout } from "@/hooks/use-whatsapp-checkout"
import ProductImageGallery from "@/components/products/product-image-gallery"

interface ProductDetailContentProps {
	product: Product
	quantity: number
	setQuantity: Dispatch<SetStateAction<number>>
	selectedVariants: Record<string, string>
	handleVariantChange: (variantType: string, value: string) => void
	handleAddToCart: () => void
	isAddingToCart: boolean
	alreadyInCart: boolean
}

export default function ProductDetailContent({
	product,
	quantity,
	setQuantity,
	selectedVariants,
	handleVariantChange,
	handleAddToCart,
	isAddingToCart,
	alreadyInCart,
}: ProductDetailContentProps) {
	const [isBuyingNow, setIsBuyingNow] = useState(false)
	const { createCheckoutLink } = useWhatsappCheckout()

	// Buy now function (WhatsApp Checkout)
	const handleBuyNow = () => {
		if (isBuyingNow) return

		setIsBuyingNow(true)

		try {
			// Create a direct WhatsApp checkout link
			const checkoutLink = createCheckoutLink(
				[
					{
						product,
						quantity,
						selected_variants: selectedVariants,
					},
				],
				{
					name: "",
					phone: "",
					address: "",
				},
			)

			// Redirect to WhatsApp
			window.open(checkoutLink, "_blank")
		} catch (error) {
			console.error("Error creating checkout link:", error)
			toast.error("Gagal membuat link checkout")
		} finally {
			setIsBuyingNow(false)
		}
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Product Images */}
				<div className="relative">
					<ProductImageGallery images={product.images || []} />
				</div>

				{/* Product Info */}
				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
						<p className="text-lg text-gray-600 mt-2">{product.description}</p>
					</div>

					<div className="flex items-center space-x-4">
						<span className="text-3xl font-bold text-primary">
							{formatPrice(product.price)}
						</span>
						{(product.stock ?? 0) > 0 ? (
							<span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
								Stok Tersedia
							</span>
						) : (
							<span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded">
								Stok Habis
							</span>
						)}
					</div>

					{/* Product Details */}
					{product.details && Object.keys(product.details).length > 0 && (
						<div className="border-t border-b py-4">
							<h3 className="font-semibold mb-2">Spesifikasi Produk</h3>
							<div className="grid grid-cols-2 gap-4">
								{Object.entries(product.details).map(([key, value]) => (
									<div key={key}>
										<span className="text-sm text-gray-600">{key}</span>
										<p className="font-medium">{value as string}</p>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Product Attributes */}
					{product.attributes && Object.keys(product.attributes).length > 0 && (
						<div className="border-t border-b py-4">
							<h3 className="font-semibold mb-2">Atribut Produk</h3>
							<div className="grid grid-cols-2 gap-4">
								{Object.entries(product.attributes).map(([key, value]) => (
									<div key={key}>
										<span className="text-sm text-gray-600">{key}</span>
										<p className="font-medium">{value as string}</p>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Product Variants */}
					{product.variants && Object.keys(product.variants).length > 0 && (
						<div className="border-t border-b py-4">
							<h3 className="font-semibold mb-2">Varian Produk</h3>
							<div className="space-y-4">
								{Object.entries(product.variants).map(([key, values]) => (
									<div key={key}>
										<h4 className="text-sm font-medium text-gray-600 mb-2">
											{key.charAt(0).toUpperCase() + key.slice(1)}
										</h4>
										<div className="flex flex-wrap gap-2">
											{Array.isArray(values) &&
												values.map((value) => (
													<button
														key={value}
														onClick={() => handleVariantChange(key, value)}
														className={`px-3 py-1 border rounded-md text-sm ${
															selectedVariants[key] === value
																? "bg-primary text-white border-primary"
																: "hover:border-primary"
														}`}
													>
														{value}
													</button>
												))}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Quantity */}
					<div className="border-t border-b py-4">
						<h3 className="font-semibold mb-2">Jumlah</h3>
						<div className="flex items-center">
							<button
								className="w-10 h-10 rounded-l-md border flex items-center justify-center"
								onClick={() => setQuantity(Math.max(1, quantity - 1))}
								disabled={quantity <= 1}
							>
								-
							</button>
							<input
								type="number"
								className="w-16 h-10 border-t border-b text-center"
								value={quantity}
								onChange={(e) =>
									setQuantity(Math.max(1, parseInt(e.target.value) || 1))
								}
								min="1"
							/>
							<button
								className="w-10 h-10 rounded-r-md border flex items-center justify-center"
								onClick={() => setQuantity(quantity + 1)}
							>
								+
							</button>
						</div>
					</div>

					{/* Add to Cart Button */}
					<button
						onClick={handleAddToCart}
						disabled={
							!product.stock ||
							product.stock <= 0 ||
							alreadyInCart ||
							isAddingToCart
						}
						className={`w-full py-3 px-4 rounded-md flex items-center justify-center font-medium transition-colors ${
							!product.stock || product.stock <= 0
								? "bg-gray-200 text-gray-500 cursor-not-allowed"
								: alreadyInCart
								? "bg-green-500 text-white"
								: "bg-primary text-white hover:bg-primary/90"
						}`}
					>
						{isAddingToCart ? (
							<span className="flex items-center">
								<svg
									className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Menambahkan...
							</span>
						) : alreadyInCart ? (
							<span className="flex items-center">
								<Check className="h-5 w-5 mr-2" />
								Ditambahkan
							</span>
						) : !product.stock || product.stock <= 0 ? (
							"Stok Habis"
						) : (
							<span className="flex items-center">
								<ShoppingCart className="h-5 w-5 mr-2" />
								Tambah ke Keranjang
							</span>
						)}
					</button>

					{/* Additional Info */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Informasi Produk</h3>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-600">Kategori</p>
								<p className="font-medium">{product.category?.name}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600">Tanggal Ditambahkan</p>
								<p className="font-medium">
									{new Date(product.created_at).toLocaleDateString("id-ID")}
								</p>
							</div>
							{product.is_new && (
								<div>
									<p className="text-sm text-gray-600">Status</p>
									<p className="font-medium text-green-600">Produk Baru</p>
								</div>
							)}
							{product.is_featured && (
								<div>
									<p className="text-sm text-gray-600">Status</p>
									<p className="font-medium text-blue-600">Produk Unggulan</p>
								</div>
							)}
						</div>
					</div>

					{/* Product Benefits */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
						<div className="flex items-center space-x-2">
							<Package className="h-5 w-5 text-primary" />
							<span className="text-sm">Produk Original</span>
						</div>
						<div className="flex items-center space-x-2">
							<Truck className="h-5 w-5 text-primary" />
							<span className="text-sm">Pengiriman Cepat</span>
						</div>
						<div className="flex items-center space-x-2">
							<RefreshCw className="h-5 w-5 text-primary" />
							<span className="text-sm">Garansi 7 Hari</span>
						</div>
					</div>

					{/* Additional Actions */}
					<div className="flex gap-4 text-gray-600">
						<button className="flex items-center text-sm hover:text-primary">
							<Heart className="h-4 w-4 mr-1" />
							Simpan
						</button>
						<button className="flex items-center text-sm hover:text-primary">
							<Share2 className="h-4 w-4 mr-1" />
							Bagikan
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
