"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Check, AlertCircle } from "lucide-react"
import type { Product } from "@/types/api"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"

interface AddToCartButtonProps {
	product: Product
	disabled?: boolean
	quantity?: number
	selectedVariants?: Record<string, string>
	size?: "default" | "sm" | "lg"
	variant?: "default" | "outline" | "secondary"
}

export default function AddToCartButton({
	product,
	disabled = false,
	quantity = 1,
	selectedVariants,
	size = "default",
	variant = "default",
}: AddToCartButtonProps) {
	const [isAdding, setIsAdding] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)
	const { addItem, isInCart } = useCart()

	const alreadyInCart = isInCart(product.id, selectedVariants)

	// Reset success state after showing
	useEffect(() => {
		let timeout: NodeJS.Timeout
		if (showSuccess) {
			timeout = setTimeout(() => {
				setShowSuccess(false)
			}, 2000)
		}
		return () => clearTimeout(timeout)
	}, [showSuccess])

	const handleAddToCart = () => {
		if (disabled || alreadyInCart) return

		setIsAdding(true)

		// Simulate a small delay for better UX
		setTimeout(() => {
			addItem(product, quantity, selectedVariants)
			setIsAdding(false)
			setShowSuccess(true)

			// Show toast notification
			toast.success("Added to cart", {
				description: `${product.name} × ${quantity} added to your cart`,
				action: {
					label: "View Cart",
					onClick: () => {
						// Navigate to cart or open cart drawer
						console.log("Navigate to cart")
					},
				},
			})
		}, 600)
	}

	return (
		<div className="relative">
			<Button
				onClick={handleAddToCart}
				disabled={disabled || isAdding}
				size={size}
				variant={alreadyInCart ? "secondary" : variant}
				className={cn(
					"w-full relative overflow-hidden group transition-all duration-300",
					alreadyInCart && "bg-green-500 hover:bg-green-600 text-white",
					showSuccess && "bg-green-500 text-white",
				)}
			>
				<AnimatePresence mode="wait">
					{isAdding ? (
						<motion.div
							key="loading"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="flex items-center justify-center"
						>
							<svg
								className="animate-spin -ml-1 mr-2 h-4 w-4"
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
							<span>Adding...</span>
						</motion.div>
					) : showSuccess || alreadyInCart ? (
						<motion.div
							key="success"
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.8, opacity: 0 }}
							className="flex items-center justify-center"
						>
							<Check className="h-4 w-4 mr-2" />
							<span>Added to Cart</span>
						</motion.div>
					) : disabled ? (
						<motion.div
							key="disabled"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="flex items-center justify-center"
						>
							<AlertCircle className="h-4 w-4 mr-2" />
							<span>Out of Stock</span>
						</motion.div>
					) : (
						<motion.div
							key="default"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="flex items-center justify-center"
						>
							<ShoppingCart className="h-4 w-4 mr-2 group-hover:animate-bounce" />
							<span>Add to Cart</span>
						</motion.div>
					)}
				</AnimatePresence>
			</Button>

			{/* Background animation when adding to cart */}
			{isAdding && (
				<motion.div
					initial={{ width: "0%" }}
					animate={{ width: "100%" }}
					transition={{ duration: 0.6 }}
					className="absolute bottom-0 left-0 h-1 bg-green-400"
				/>
			)}
		</div>
	)
}
