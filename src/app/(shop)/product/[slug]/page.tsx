// src/app/(shop)/product/[slug]/page.tsx
import { Metadata } from "next"
import { productAPI } from "@/lib/api"
import ProductDetail from "./product-detail"
import { notFound } from "next/navigation"

interface ProductPageProps {
	params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
	try {
		const { data: product } = await productAPI.getBySlug(slug)
		return product || null
	} catch (error) {
		console.error("Error fetching product:", error)
		return null
	}
}

// Generate metadata for SEO
export async function generateMetadata(
	props: ProductPageProps,
): Promise<Metadata> {
	const { slug } = await props.params
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
	const { slug } = await props.params
	const product = await getProduct(slug)

	if (!product) {
		notFound()
	}

	return <ProductDetail params={{ slug }} initialProduct={product} />
}
