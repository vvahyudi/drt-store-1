// src/components/ui/image-fallback.tsx
"use client"

import { useState } from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface ImageFallbackProps extends ImageProps {
	fallbackSrc?: string
	fallbackClassName?: string
	fallbackComponent?: React.ReactNode
}

export default function ImageFallback({
	src,
	alt,
	fallbackSrc = "",
	fallbackClassName,
	fallbackComponent,
	className,
	...props
}: ImageFallbackProps) {
	const [error, setError] = useState<boolean>(false)

	// Handling the case where we want to use a fallback component instead
	if (error && fallbackComponent) {
		return <>{fallbackComponent}</>
	}

	return (
		<Image
			src={error ? fallbackSrc : src}
			alt={alt}
			className={cn(className, error && fallbackClassName)}
			onError={() => setError(true)}
			{...props}
		/>
	)
}

// Untuk digunakan seperti ini:
// <ImageFallback
//   src={category.image_url || ''}
//   alt={category.name}
//   fill
//   className="object-cover"
//   fallbackComponent={
//     <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center">
//       <span className="text-primary font-medium text-lg">{category.name}</span>
//     </div>
//   }
// />
