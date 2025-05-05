"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { motion } from "motion/react"
import { useRouter } from "next/navigation"

export default function CartPage() {
	const router = useRouter()
	const { items, updateQuantity, removeItem, total } = useCart()

	const handleCheckout = () => {
		router.push("/checkout")
		router.refresh()
	}

	if (items.length === 0) {
		return (
			<div className="container px-4 mx-auto py-16 text-center">
				<div className="mx-auto max-w-md">
					<motion.div
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ type: "spring" }}
					>
						<ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
					</motion.div>
					<h2 className="mt-6 text-2xl font-bold text-gray-800">
						Keranjang Anda Kosong
					</h2>
					<p className="mt-2 text-gray-600">
						Belum ada produk yang ditambahkan ke keranjang belanja Anda.
					</p>
					<Link
						href="/products"
						className="mt-6 inline-block bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-md"
					>
						Mulai Belanja
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="container px-4 mx-auto py-8">
			<h1 className="text-3xl font-bold mb-8 text-gray-800">
				Keranjang Belanja
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Product List */}
				<div className="md:col-span-2">
					<div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
						<div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b">
							<div className="col-span-2 font-medium text-gray-700">Produk</div>
							<div className="font-medium text-gray-700">Harga</div>
							<div className="font-medium text-gray-700">Jumlah</div>
							<div className="font-medium text-gray-700 text-right">
								Subtotal
							</div>
						</div>

						<ul className="divide-y divide-gray-100">
							{items.map((item) => (
								<motion.li
									key={`${item.product.id}-${JSON.stringify(
										item.selected_variants,
									)}`}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.2 }}
									className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-center hover:bg-gray-50/50 transition-colors"
								>
									{/* Product Info */}
									<div className="md:col-span-2 flex items-center">
										<div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
											{item.product.images?.[0]?.url ? (
												<Image
													src={item.product.images[0].url}
													alt={item.product.name}
													fill
													className="object-cover"
												/>
											) : (
												<div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
													<span className="text-xs text-gray-500">Gambar</span>
												</div>
											)}
										</div>
										<div className="ml-4 flex-1">
											<h3 className="font-medium text-gray-800">
												<Link
													href={`/product/${item.product.slug}`}
													className="hover:text-primary transition-colors"
												>
													{item.product.name}
												</Link>
											</h3>
											{item.selected_variants &&
												Object.keys(item.selected_variants).length > 0 && (
													<div className="text-sm text-gray-500 mt-1 space-y-1">
														{Object.entries(item.selected_variants).map(
															([key, value]) => (
																<div key={key}>
																	<span className="capitalize">{key}</span>:{" "}
																	{value}
																</div>
															),
														)}
													</div>
												)}
										</div>
									</div>

									{/* Price */}
									<div className="text-gray-700 font-medium">
										{formatPrice(item.product.price)}
									</div>

									{/* Quantity Controls */}
									<div className="flex items-center">
										<div className="flex border border-gray-300 rounded-lg overflow-hidden">
											<button
												className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
												onClick={() =>
													updateQuantity(
														item.product.id,
														item.selected_variants,
														Math.max(1, item.quantity - 1),
													)
												}
												aria-label="Kurangi jumlah"
											>
												<Minus className="h-4 w-4" />
											</button>
											<span className="px-4 py-1 bg-white w-12 text-center">
												{item.quantity}
											</span>
											<button
												className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
												onClick={() =>
													updateQuantity(
														item.product.id,
														item.selected_variants,
														item.quantity + 1,
													)
												}
												aria-label="Tambah jumlah"
											>
												<Plus className="h-4 w-4" />
											</button>
										</div>

										<button
											className="ml-4 text-red-500 hover:text-red-700 transition-colors p-1"
											onClick={() =>
												removeItem(item.product.id, item.selected_variants)
											}
											aria-label="Hapus produk"
										>
											<Trash2 className="h-5 w-5" />
										</button>
									</div>

									{/* Subtotal */}
									<div className="text-right font-medium text-gray-800">
										{formatPrice(item.product.price * item.quantity)}
									</div>
								</motion.li>
							))}
						</ul>
					</div>
				</div>

				{/* Order Summary */}
				<div>
					<div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 border border-gray-100">
						<h2 className="text-xl font-bold mb-4 text-gray-800">
							Ringkasan Pesanan
						</h2>

						<div className="space-y-3">
							<div className="flex justify-between text-gray-600">
								<span>Subtotal</span>
								<span className="font-medium">{formatPrice(total)}</span>
							</div>

							<div className="flex justify-between text-gray-600">
								<span>Ongkos Kirim</span>
								<span>Akan dihitung saat checkout</span>
							</div>

							<div className="border-t border-gray-200 my-4 pt-4"></div>

							<div className="flex justify-between font-bold text-lg text-gray-800">
								<span>Total</span>
								<span>{formatPrice(total)}</span>
							</div>
						</div>

						<div className="mt-6 space-y-3">
							<motion.button
								onClick={handleCheckout}
								className="bg-primary text-white py-3 px-4 rounded-lg w-full flex items-center justify-center font-medium hover:bg-primary/90 transition-colors shadow-md"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								Lanjut ke Pembayaran
								<ArrowRight className="ml-2 h-4 w-4" />
							</motion.button>

							<Link
								href="/products"
								className="mt-3 text-center block py-3 text-gray-600 hover:text-gray-900 transition-colors font-medium"
							>
								Lanjutkan Belanja
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
