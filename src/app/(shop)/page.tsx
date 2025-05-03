// src/app/(shop)/page.tsx
import { Product, Category } from "@/types/api"
import { productAPI, categoryAPI } from "@/lib/api"
import { ShoppingBag, Tag, Star, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Components
import HeroSection from "@/components/sections/hero-section"
import CategoryShowcase from "@/components/sections/category-showcase"
import ProductCard from "@/components/products/product-card"
import PromoBanner from "@/components/sections/promo-banner"
import BenefitsSection from "@/components/sections/benefits-section"
import TestimonialsSection from "@/components/sections/testimonials-section"
import CTASection from "@/components/sections/cta-section"
import SectionHeader from "@/components/sections/section-header"

async function getFeaturedProducts() {
	try {
		const response = await productAPI.getAll({
			limit: 8,
			sort: "is_featured.desc",
		})
		return (response.data || []).filter((product) => !product.is_deleted)
	} catch (error) {
		console.error("Error fetching featured products:", error)
		return []
	}
}

async function getNewArrivals() {
	try {
		const response = await productAPI.getAll({
			limit: 8,
			sort: "created_at.desc",
		})
		return (response.data || []).filter((product) => !product.is_deleted)
	} catch (error) {
		console.error("Error fetching new arrivals:", error)
		return []
	}
}

async function getCategories() {
	try {
		const response = await categoryAPI.getAll({
			limit: 4,
		})
		return response.data || []
	} catch (error) {
		console.error("Error fetching categories:", error)
		return []
	}
}

export default async function HomePage() {
	const [featuredProducts, newArrivals, categories] = await Promise.all([
		getFeaturedProducts(),
		getNewArrivals(),
		getCategories(),
	])

	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<HeroSection
				title="Temukan Produk Berkualitas untuk"
				subtitle="Kebutuhan Anda"
				description="DRT-Store menyediakan berbagai pilihan produk berkualitas dengan harga terjangkau. Belanja sekarang dan dapatkan pengalaman berbelanja terbaik!"
				primaryButtonText="Belanja Sekarang"
				primaryButtonLink="/products"
				secondaryButtonText="Lihat Kategori"
				secondaryButtonLink="/categories"
				imageSrc="/images/hero-image.jpg"
				imageAlt="DRT Store Hero Image"
			/>

			{/* Category Showcase */}
			<section className="py-12 bg-gray-50">
				<div className="container">
					<SectionHeader
						title="Kategori Unggulan"
						description="Temukan produk berdasarkan kategori kebutuhan Anda"
						icon={<ShoppingBag className="text-primary h-6 w-6" />}
					>
						<Button asChild variant="outline">
							<Link href="/categories">
								Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</SectionHeader>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
						{categories.map((category) => (
							<Link
								key={category.id}
								href={`/category/${category.slug}`}
								className="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
							>
								<div className="aspect-[4/3] w-full bg-gray-100">
									{category.image_url && (
										<img
											src={category.image_url}
											alt={category.name}
											className="h-full w-full object-cover transition-transform group-hover:scale-105"
										/>
									)}
								</div>
								<div className="p-4">
									<h3 className="font-semibold">{category.name}</h3>
									{category.description && (
										<p className="mt-1 text-sm text-gray-600 line-clamp-2">
											{category.description}
										</p>
									)}
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Featured Products */}
			<section className="py-12 bg-white">
				<div className="container">
					<SectionHeader
						title="Produk Unggulan"
						description="Produk terbaik dan paling diminati"
						icon={<Star className="text-yellow-500 h-6 w-6" />}
					>
						<Button asChild variant="outline">
							<Link href="/products?sort=is_featured.desc">
								Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</SectionHeader>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
						{featuredProducts.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								badge={
									product.is_featured ? (
										<span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded">
											Unggulan
										</span>
									) : null
								}
							/>
						))}
					</div>
				</div>
			</section>

			{/* Promo Banner */}
			<PromoBanner
				title="Penawaran Spesial"
				description="Dapatkan diskon spesial untuk produk pilihan. Penawaran terbatas, jangan sampai kehabisan!"
				buttonText="Lihat Penawaran"
				buttonLink="/products?sort=is_featured.desc"
				buttonIcon={<Tag className="mr-2 h-5 w-5" />}
				promoItems={[
					{ title: "20%", subtitle: "Diskon Produk Baru" },
					{ title: "Gratis", subtitle: "Pengiriman Min. 100k" },
					{ title: "Cashback", subtitle: "Untuk Pembelian Kedua" },
					{ title: "Hadiah", subtitle: "Untuk Pembelian >500k" },
				]}
			/>

			{/* New Arrivals */}
			<section className="py-12 bg-gray-50">
				<div className="container">
					<SectionHeader
						title="Produk Terbaru"
						description="Koleksi terbaru yang baru saja ditambahkan"
						icon={<Clock className="text-blue-500 h-6 w-6" />}
					>
						<Button asChild variant="outline">
							<Link href="/products?sort=created_at.desc">
								Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</SectionHeader>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
						{newArrivals.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								badge={
									new Date(product.created_at) >
									new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? (
										<span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
											Baru!
										</span>
									) : null
								}
							/>
						))}
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<BenefitsSection />

			{/* Testimonials Section */}
			<TestimonialsSection />

			{/* Call to Action */}
			<CTASection
				title="Siap untuk Berbelanja?"
				description="Jelajahi koleksi produk kami dan temukan barang yang sesuai dengan kebutuhan Anda. Nikmati pengalaman berbelanja yang mudah dan aman."
				buttonText="Mulai Belanja"
				buttonLink="/products"
			/>
		</div>
	)
}
