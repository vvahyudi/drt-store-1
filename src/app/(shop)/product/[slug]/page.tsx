// src/app/(shop)/product/[slug]/page.tsx
import { Metadata } from "next"
import { productAPI } from "@/lib/api"
import ProductDetail from "./product-detail"
import { notFound } from "next/navigation"

interface ProductPageProps {
	params: {
		slug: string
	}
}

async function getProduct(slug: string) {
	try {
		const { data: product } = await productAPI.getBySlug(slug)
		if (!product) {
			return null
		}
		return product
	} catch (error) {
		console.error("Error fetching product:", error)
		return null
	}
}

// Generate metadata for SEO
// Generate metadata for SEO
export async function generateMetadata(
	props: ProductPageProps,
): Promise<Metadata> {
	// Access params without destructuring
	const params = await props.params
	const slug = params.slug
	const product = await getProduct(slug)

	if (!product) {
		return {
			title: "Product Not Found",
			description: "The requested product could not be found.",
		}
	}

	return {
		title: product.name,
		description: product.description,
		openGraph: {
			title: product.name,
			description: product.description,
			images: product.images?.[0] ? [product.images[0]] : [],
		},
	}
}

export default async function ProductPage(props: ProductPageProps) {
	const params = await props.params
	const slug = params.slug
	const product = await getProduct(slug)

	if (!product) {
		notFound() // This is correct usage of notFound() [^1]
	}

	return <ProductDetail params={{ slug }} initialProduct={product} />
}
