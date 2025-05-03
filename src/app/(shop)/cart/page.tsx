// src/app/(shop)/cart/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { motion } from "motion/react" // Changed from 'motion/react' to 'framer-motion'
import { useRouter } from "next/navigation"

export default function CartPage() {
	const router = useRouter()
	const { items, updateQuantity, removeItem, total } = useCart()

	const handleCheckout = () => {
		router.push("/checkout")
		router.refresh() // Add this to ensure navigation
	}

	if (items.length === 0) {
		return (
			<div className="container px-4 mx-auto py-16 text-center">
				<div className="mx-auto max-w-md">
					<ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
					<h2 className="mt-4 text-2xl font-bold">Your cart is empty</h2>
					<p className="mt-2 text-gray-600">
						Looks like you haven&apos;t added anything to your cart yet.
					</p>
					<Link
						href="/products"
						className="mt-6 inline-block bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
					>
						Continue Shopping
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="container px-4 mx-auto py-8">
			<h1 className="text-3xl font-bold mb-8">Your Cart</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="md:col-span-2">
					<div className="bg-white rounded-lg shadow-sm overflow-hidden">
						<div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b">
							<div className="col-span-2 font-medium">Product</div>
							<div className="font-medium">Price</div>
							<div className="font-medium">Quantity</div>
							<div className="font-medium text-right">Total</div>
						</div>

						<ul className="divide-y">
							{items.map((item) => (
								<motion.li
									key={`${item.product.id}-${JSON.stringify(
										item.selected_variants,
									)}`}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.2 }}
									className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
								>
									<div className="md:col-span-2 flex items-center">
										<div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
											{/* This would be the product image - using placeholder for now */}
											<div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
												<span className="text-xs text-gray-500">Image</span>
											</div>
										</div>
										<div className="ml-4 flex-1">
											<h3 className="font-medium">
												<Link
													href={`/product/${item.product.slug}`}
													className="hover:text-primary"
												>
													{item.product.name}
												</Link>
											</h3>
											{item.selected_variants &&
												Object.keys(item.selected_variants).length > 0 && (
													<div className="text-sm text-gray-500 mt-1">
														{Object.entries(item.selected_variants).map(
															([key, value]) => (
																<div key={key}>
																	{key}: {value}
																</div>
															),
														)}
													</div>
												)}
										</div>
									</div>

									<div className="text-gray-600">
										{formatPrice(item.product.price)}
									</div>

									<div className="flex items-center">
										<div className="flex border rounded-md">
											<button
												className="px-2 py-1 border-r"
												onClick={() =>
													updateQuantity(
														item.product.id,
														item.selected_variants,
														Math.max(1, item.quantity - 1),
													)
												}
											>
												<Minus className="h-4 w-4" />
											</button>
											<span className="px-4 py-1">{item.quantity}</span>
											<button
												className="px-2 py-1 border-l"
												onClick={() =>
													updateQuantity(
														item.product.id,
														item.selected_variants,
														item.quantity + 1,
													)
												}
											>
												<Plus className="h-4 w-4" />
											</button>
										</div>

										<button
											className="ml-4 text-red-500 hover:text-red-700"
											onClick={() =>
												removeItem(item.product.id, item.selected_variants)
											}
										>
											<Trash2 className="h-5 w-5" />
										</button>
									</div>

									<div className="text-right font-medium">
										{formatPrice(item.product.price * item.quantity)}
									</div>
								</motion.li>
							))}
						</ul>
					</div>
				</div>

				<div>
					<div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
						<h2 className="text-xl font-bold mb-4">Order Summary</h2>

						<div className="space-y-3">
							<div className="flex justify-between text-gray-600">
								<span>Subtotal</span>
								<span>{formatPrice(total)}</span>
							</div>

							<div className="flex justify-between text-gray-600">
								<span>Shipping</span>
								<span>Calculated at checkout</span>
							</div>

							<div className="border-t my-4 pt-4"></div>

							<div className="flex justify-between font-bold text-lg">
								<span>Total</span>
								<span>{formatPrice(total)}</span>
							</div>
						</div>

						<div className="mt-6">
							<button
								onClick={handleCheckout}
								className="bg-primary text-white py-3 px-4 rounded-md w-full flex items-center justify-center font-medium hover:bg-primary/90 transition-colors"
							>
								Proceed to Checkout
								<ArrowRight className="ml-2 h-4 w-4" />
							</button>

							<Link
								href="/products"
								className="mt-3 text-center block py-3 text-gray-600 hover:text-gray-900"
							>
								Continue Shopping
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
