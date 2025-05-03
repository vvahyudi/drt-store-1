"use client"

import { useState } from "react"
import { Product } from "@/types/api"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import {
	ShoppingCart,
	Heart,
	Share2,
	Check,
	Package,
	Truck,
	RefreshCw,
} from "lucide-react"
import { toast } from "sonner"
import ProductImageGallery from "@/components/products/product-image-gallery"
import ProductDetailContent from "./product-detail-content"

interface ProductDetailProps {
	params: {
		slug: string
	}
	initialProduct: Product
}

export default function ProductDetail({
	params,
	initialProduct,
}: ProductDetailProps) {
	const [product] = useState<Product>(initialProduct)
	const [quantity, setQuantity] = useState(1)
	const [selectedVariants, setSelectedVariants] = useState<
		Record<string, string>
	>({})
	const [isAddingToCart, setIsAddingToCart] = useState(false)
	const { addItem, isInCart } = useCart()

	const alreadyInCart = isInCart(product.id, selectedVariants)

	// Handle variant selection
	const handleVariantChange = (variantType: string, value: string) => {
		setSelectedVariants((prev) => ({
			...prev,
			[variantType]: value,
		}))
	}

	// Add to cart function
	const handleAddToCart = () => {
		if (alreadyInCart || isAddingToCart) return

		setIsAddingToCart(true)

		// Simulate a small delay for better UX
		setTimeout(() => {
			addItem(product, quantity, selectedVariants)
			setIsAddingToCart(false)
		}, 500)
	}

	return (
		<ProductDetailContent
			product={product}
			quantity={quantity}
			setQuantity={setQuantity}
			selectedVariants={selectedVariants}
			handleVariantChange={handleVariantChange}
			handleAddToCart={handleAddToCart}
			isAddingToCart={isAddingToCart}
			alreadyInCart={alreadyInCart}
		/>
	)
}
