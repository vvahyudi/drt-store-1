import { useCallback, useEffect, useState } from "react"
import { CartItem, Product } from "@/types/api"
import { toast } from "sonner"

// Cart will be stored in local storage
const CART_STORAGE_KEY = "drt-store-cart"

export function useCart() {
	const [items, setItems] = useState<CartItem[]>([])
	const [isLoaded, setIsLoaded] = useState(false)
	const [lastToastTime, setLastToastTime] = useState(0)

	// Calculate total price
	const total = items.reduce(
		(acc, item) => acc + item.product.price * item.quantity,
		0,
	)

	// Load cart from localStorage
	useEffect(() => {
		try {
			const storedCart = localStorage.getItem(CART_STORAGE_KEY)
			if (storedCart) {
				setItems(JSON.parse(storedCart))
			}
		} catch (error) {
			console.error("Failed to load cart from localStorage:", error)
		} finally {
			setIsLoaded(true)
		}
	}, [])

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
		}
	}, [items, isLoaded])

	// Show toast with debounce
	const showToast = useCallback(
		(message: string) => {
			const now = Date.now()
			if (now - lastToastTime > 1000) {
				// 1 second debounce
				toast.success(message)
				setLastToastTime(now)
			}
		},
		[lastToastTime],
	)

	// Add item to cart
	const addItem = useCallback(
		(product: Product, quantity = 1, selectedVariants = {}) => {
			setItems((prev) => {
				// Check if product is already in cart
				const existingItemIndex = prev.findIndex(
					(item) =>
						item.product.id === product.id &&
						JSON.stringify(item.selected_variants) ===
							JSON.stringify(selectedVariants),
				)

				if (existingItemIndex !== -1) {
					// Update existing item quantity
					const updatedItems = [...prev]
					updatedItems[existingItemIndex].quantity += quantity
					showToast("Cart updated")
					return updatedItems
				} else {
					// Add new item
					showToast("Item added to cart")
					return [
						...prev,
						{ product, quantity, selected_variants: selectedVariants },
					]
				}
			})
		},
		[showToast],
	)

	// Update item quantity
	const updateQuantity = useCallback(
		(
			productId: string,
			variants: Record<string, string> | undefined,
			quantity: number,
		) => {
			setItems((prev) => {
				const updatedItems = prev.map((item) => {
					if (
						item.product.id === productId &&
						JSON.stringify(item.selected_variants) === JSON.stringify(variants)
					) {
						return { ...item, quantity }
					}
					return item
				})

				showToast("Cart updated")
				return updatedItems
			})
		},
		[showToast],
	)

	// Remove item from cart
	const removeItem = useCallback(
		(productId: string, variants: Record<string, string> | undefined) => {
			setItems((prev) => {
				const updatedItems = prev.filter(
					(item) =>
						item.product.id !== productId ||
						JSON.stringify(item.selected_variants) !== JSON.stringify(variants),
				)

				showToast("Item removed from cart")
				return updatedItems
			})
		},
		[showToast],
	)

	// Clear cart
	const clearCart = useCallback(() => {
		setItems([])
		showToast("Cart cleared")
	}, [showToast])

	// Check if product is in cart
	const isInCart = useCallback(
		(productId: string, variants: Record<string, string> | undefined) => {
			return items.some(
				(item) =>
					item.product.id === productId &&
					JSON.stringify(item.selected_variants) === JSON.stringify(variants),
			)
		},
		[items],
	)

	return {
		items,
		total,
		isLoaded,
		addItem,
		updateQuantity,
		removeItem,
		clearCart,
		isInCart,
	}
}
