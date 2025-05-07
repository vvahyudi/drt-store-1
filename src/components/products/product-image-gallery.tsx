// src/components/products/product-image-gallery.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { ProductImage } from "@/types/api"

interface ProductImageGalleryProps {
	images: ProductImage[]
}

export default function ProductImageGallery({
	images,
}: ProductImageGalleryProps) {
	const [selectedImage, setSelectedImage] = useState<ProductImage | null>(
		images.find((img) => img.is_primary) || images[0] || null,
	)

	if (!selectedImage) {
		return (
			<div className="relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
				<span className="text-gray-400">No image available</span>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			{/* Main Image */}
			<div className="relative aspect-square rounded-lg overflow-hidden bg-white border">
				<Image
					src={selectedImage.url}
					alt="Product image"
					fill
					className="object-contain"
					priority
				/>
			</div>

			{/* Thumbnails */}
			{images.length > 1 && (
				<div className="relative">
					<div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
						{images.map((image, index) => (
							<button
								key={`${image.id}-${index}`}
								onClick={() => setSelectedImage(image)}
								className={`flex-shrink-0 rounded-md overflow-hidden border-2 ${
									selectedImage.id === image.id
										? "border-primary"
										: "border-transparent"
								}`}
							>
								<div className="relative w-20 aspect-square">
									<Image
										src={image.url}
										alt={`Product thumbnail ${index + 1}`}
										fill
										className="object-cover"
									/>
								</div>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
