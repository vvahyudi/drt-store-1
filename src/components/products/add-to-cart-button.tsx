// src/components/products/add-to-cart-button.tsx
"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { Product } from "@/types/api"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

interface AddToCartButtonProps {
	product: Product
	disabled?: boolean
	quantity?: number
	selectedVariants?: Record<string, string>
}

export default function AddToCartButton({
	product,
	disabled = false,
	quantity = 1,
	selectedVariants,
}: AddToCartButtonProps) {
	const [isAdding, setIsAdding] = useState(false)
	const { addItem, isInCart } = useCart()

	const alreadyInCart = isInCart(product.id, selectedVariants)

	const handleAddToCart = () => {
		if (disabled || alreadyInCart) return

		setIsAdding(true)

		// Simulate a small delay for better UX
		setTimeout(() => {
			addItem(product, quantity, selectedVariants)
			setIsAdding(false)
		}, 500)
	}

	return (
		<button
			onClick={handleAddToCart}
			disabled={disabled || isAdding || alreadyInCart}
			className={`w-full py-3 px-4 rounded-md flex items-center justify-center font-medium transition-colors ${
				disabled
					? "bg-gray-200 text-gray-500 cursor-not-allowed"
					: alreadyInCart
					? "bg-green-500 text-white"
					: "bg-primary text-white hover:bg-primary/90"
			}`}
		>
			{isAdding ? (
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
					Adding...
				</span>
			) : alreadyInCart ? (
				<span className="flex items-center">
					<Check className="h-5 w-5 mr-2" />
					Added to Cart
				</span>
			) : disabled ? (
				"Out of Stock"
			) : (
				<span className="flex items-center">
					<ShoppingCart className="h-5 w-5 mr-2" />
					Add to Cart
				</span>
			)}
		</button>
	)
}
