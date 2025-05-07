"use client"

import { useState, type Dispatch, type SetStateAction } from "react"
import type { Product } from "@/types/api"
import { formatPrice } from "@/lib/utils"
import {
	ShoppingCart,
	Check,
	ArrowRight,
	Share2,
	Heart,
	Truck,
	RefreshCw,
	Package,
	Info,
	ShieldCheck,
} from "lucide-react"
import { toast } from "sonner"
import { useWhatsappCheckout } from "@/hooks/use-whatsapp-checkout"
import ProductImageGallery from "@/components/products/product-image-gallery"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
	const [activeTab, setActiveTab] = useState<
		"description" | "details" | "shipping"
	>("description")
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
		<div className="container mx-auto px-4 py-6 md:py-10">
			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
				{/* Product Images - Bento Card 1 */}
				<div className="lg:col-span-6 rounded-xl overflow-hidden bg-white shadow-sm border border-border/40">
					<ProductImageGallery images={product.images || []} />
				</div>

				{/* Product Info - Bento Card 2 */}
				<div className="lg:col-span-6 space-y-5">
					<div className="bg-white rounded-xl p-6 shadow-sm border border-border/40">
						{/* Product Status Badges */}
						<div className="flex flex-wrap gap-2 mb-3">
							{product.is_new && (
								<Badge className="bg-emerald-500 hover:bg-emerald-600">
									Baru
								</Badge>
							)}
							{product.is_featured && (
								<Badge className="bg-amber-500 hover:bg-amber-600">
									Unggulan
								</Badge>
							)}
							{(product.stock ?? 0) > 0 ? (
								<Badge
									variant="outline"
									className="text-green-600 border-green-200 bg-green-50"
								>
									Stok Tersedia
								</Badge>
							) : (
								<Badge
									variant="outline"
									className="text-red-600 border-red-200 bg-red-50"
								>
									Stok Habis
								</Badge>
							)}
						</div>

						{/* Product Title */}
						<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
							{product.name}
						</h1>

						{/* Price */}
						<div className="flex items-center gap-3 mt-4">
							<span className="text-2xl md:text-3xl font-bold text-primary">
								{formatPrice(product.price)}
							</span>
						</div>

						{/* Short Description */}
						<p className="text-gray-600 mt-4 leading-relaxed">
							{product.description}
						</p>
					</div>

					{/* Product Variants - Bento Card 3 */}
					{product.variants && Object.keys(product.variants).length > 0 && (
						<div className="bg-white rounded-xl p-6 shadow-sm border border-border/40">
							<h3 className="font-semibold mb-4 text-lg">Pilih Varian</h3>
							<div className="space-y-5">
								{Object.entries(product.variants).map(([key, values]) => (
									<div key={key}>
										<h4 className="text-sm font-medium text-gray-700 mb-2">
											{key.charAt(0).toUpperCase() + key.slice(1)}
										</h4>
										<div className="flex flex-wrap gap-2">
											{Array.isArray(values) &&
												values.map((value) => (
													<button
														key={value}
														onClick={() => handleVariantChange(key, value)}
														className={cn(
															"px-4 py-2 border rounded-lg text-sm transition-all duration-200",
															selectedVariants[key] === value
																? "bg-primary text-white border-primary ring-2 ring-primary/20"
																: "hover:border-primary/50 hover:bg-primary/5",
														)}
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

					{/* Quantity & Actions - Bento Card 4 */}
					<div className="bg-white rounded-xl p-6 shadow-sm border border-border/40">
						{/* Quantity */}
						<div className="mb-6">
							<h3 className="font-semibold mb-3">Jumlah</h3>
							<div className="flex items-center">
								<button
									className="w-12 h-12 rounded-l-lg border flex items-center justify-center bg-muted/50 hover:bg-muted transition-colors"
									onClick={() => setQuantity(Math.max(1, quantity - 1))}
									disabled={quantity <= 1}
								>
									<span className="text-xl font-medium">-</span>
								</button>
								<input
									type="number"
									className="w-20 h-12 border-t border-b text-center bg-white"
									value={quantity}
									onChange={(e) =>
										setQuantity(
											Math.max(1, Number.parseInt(e.target.value) || 1),
										)
									}
									min="1"
								/>
								<button
									className="w-12 h-12 rounded-r-lg border flex items-center justify-center bg-muted/50 hover:bg-muted transition-colors"
									onClick={() => setQuantity(quantity + 1)}
								>
									<span className="text-xl font-medium">+</span>
								</button>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Add to Cart Button */}
							<Button
								onClick={handleAddToCart}
								disabled={
									!product.stock ||
									product.stock <= 0 ||
									alreadyInCart ||
									isAddingToCart
								}
								className={cn(
									"w-full py-6 rounded-lg font-medium transition-all",
									!product.stock || product.stock <= 0
										? "bg-gray-200 text-gray-500 cursor-not-allowed"
										: alreadyInCart
										? "bg-green-500 hover:bg-green-600 text-white"
										: "bg-primary hover:bg-primary/90 text-white",
								)}
								size="lg"
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
									<span className="flex items-center justify-center">
										<Check className="h-5 w-5 mr-2" />
										Ditambahkan
									</span>
								) : !product.stock || product.stock <= 0 ? (
									"Stok Habis"
								) : (
									<span className="flex items-center justify-center">
										<ShoppingCart className="h-5 w-5 mr-2" />
										Tambah ke Keranjang
									</span>
								)}
							</Button>

							{/* Buy Now Button */}
							<Button
								onClick={handleBuyNow}
								disabled={!product.stock || product.stock <= 0 || isBuyingNow}
								variant="outline"
								className="w-full py-6 rounded-lg font-medium border-primary text-primary hover:bg-primary/5"
								size="lg"
							>
								{isBuyingNow ? (
									<span className="flex items-center justify-center">
										<svg
											className="animate-spin -ml-1 mr-2 h-5 w-5 text-primary"
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
										Memproses...
									</span>
								) : (
									<span className="flex items-center justify-center">
										<ArrowRight className="h-5 w-5 mr-2" />
										Beli Sekarang
									</span>
								)}
							</Button>
						</div>

						{/* Wishlist & Share */}
						<div className="flex justify-between mt-6">
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground hover:text-primary"
							>
								<Heart className="h-4 w-4 mr-2" />
								Simpan
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground hover:text-primary"
							>
								<Share2 className="h-4 w-4 mr-2" />
								Bagikan
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Product Benefits - Bento Card 5 */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-2">
				<div className="bg-white rounded-xl p-4 shadow-sm border border-border/40 flex flex-col items-center text-center transition-all hover:shadow-md hover:border-primary/20">
					<ShieldCheck className="h-8 w-8 text-primary mb-3" />
					<h3 className="font-medium text-sm">Produk Original</h3>
					<p className="text-xs text-muted-foreground mt-1">
						Garansi produk asli
					</p>
				</div>
				<div className="bg-white rounded-xl p-4 shadow-sm border border-border/40 flex flex-col items-center text-center transition-all hover:shadow-md hover:border-primary/20">
					<Truck className="h-8 w-8 text-primary mb-3" />
					<h3 className="font-medium">Pengiriman Cepat</h3>
					<p className="text-xs text-muted-foreground mt-1">
						Dikirim dalam 1-3 hari
					</p>
				</div>
				<div className="bg-white rounded-xl p-4 shadow-sm border border-border/40 flex flex-col items-center text-center transition-all hover:shadow-md hover:border-primary/20">
					<RefreshCw className="h-8 w-8 text-primary mb-3" />
					<h3 className="font-medium">Garansi 7 Hari</h3>
					<p className="text-xs text-muted-foreground mt-1">
						Pengembalian mudah
					</p>
				</div>
				<div className="bg-white rounded-xl p-4 shadow-sm border border-border/40 flex flex-col items-center text-center transition-all hover:shadow-md hover:border-primary/20">
					<Package className="h-8 w-8 text-primary mb-3" />
					<h3 className="font-medium">Kemasan Aman</h3>
					<p className="text-xs text-muted-foreground mt-1">
						Dikemas dengan baik
					</p>
				</div>
			</div>

			{/* Product Details Tabs - Bento Card 6 */}
			<div className="bg-white rounded-xl shadow-sm border border-border/40 mt-6">
				<div className="flex border-b overflow-x-auto scrollbar-hide">
					<button
						onClick={() => setActiveTab("description")}
						className={cn(
							"px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors",
							activeTab === "description"
								? "border-b-2 border-primary text-primary"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						Deskripsi Produk
					</button>
					<button
						onClick={() => setActiveTab("details")}
						className={cn(
							"px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors",
							activeTab === "details"
								? "border-b-2 border-primary text-primary"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						Spesifikasi
					</button>
					<button
						onClick={() => setActiveTab("shipping")}
						className={cn(
							"px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors",
							activeTab === "shipping"
								? "border-b-2 border-primary text-primary"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						Informasi Pengiriman
					</button>
				</div>

				<div className="p-6">
					{activeTab === "description" && (
						<div className="prose max-w-none">
							<p>{product.description}</p>
						</div>
					)}

					{activeTab === "details" && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Product Details */}
							{product.details && Object.keys(product.details).length > 0 && (
								<div>
									<h3 className="font-semibold mb-4 text-lg">Spesifikasi</h3>
									<div className="space-y-3">
										{Object.entries(product.details).map(([key, value]) => (
											<div
												key={key}
												className="grid grid-cols-2 gap-4 pb-2 border-b border-border/60"
											>
												<span className="text-sm text-muted-foreground">
													{key}
												</span>
												<p className="font-medium text-right">
													{value as string}
												</p>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Product Attributes */}
							{product.attributes &&
								Object.keys(product.attributes).length > 0 && (
									<div>
										<h3 className="font-semibold mb-4 text-lg">Atribut</h3>
										<div className="space-y-3">
											{Object.entries(product.attributes).map(
												([key, value]) => (
													<div
														key={key}
														className="grid grid-cols-2 gap-4 pb-2 border-b border-border/60"
													>
														<span className="text-sm text-muted-foreground">
															{key}
														</span>
														<p className="font-medium text-right">
															{value as string}
														</p>
													</div>
												),
											)}
										</div>
									</div>
								)}
						</div>
					)}

					{activeTab === "shipping" && (
						<div className="space-y-4">
							<div>
								<h3 className="font-semibold mb-2">Metode Pengiriman</h3>
								<p className="text-muted-foreground">
									Produk ini dapat dikirim melalui JNE, J&T, SiCepat, dan
									Anteraja.
								</p>
							</div>
							<div>
								<h3 className="font-semibold mb-2">Estimasi Pengiriman</h3>
								<p className="text-muted-foreground">
									1-3 hari kerja untuk wilayah Jabodetabek, 3-7 hari kerja untuk
									wilayah lainnya.
								</p>
							</div>
							<div>
								<h3 className="font-semibold mb-2">Kebijakan Pengembalian</h3>
								<p className="text-muted-foreground">
									Produk dapat dikembalikan dalam waktu 7 hari setelah diterima
									jika terdapat kerusakan atau tidak sesuai dengan deskripsi.
								</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Additional Info - Bento Card 7 */}
			<div className="bg-white rounded-xl p-6 shadow-sm border border-border/40 mt-6">
				<div className="flex items-center mb-4">
					<Info className="h-5 w-5 text-primary mr-2" />
					<h3 className="font-semibold">Informasi Produk</h3>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
					<div className="space-y-1">
						<span className="text-sm text-muted-foreground">Kategori</span>
						<p className="font-medium">{product.category?.name || "-"}</p>
					</div>
				</div>
			</div>
		</div>
	)
}
