// src/app/(shop)/page.tsx
import { Product, Category } from "@/types/api"
import { productAPI, categoryAPI } from "@/lib/api"
import { ShoppingBag, Tag } from "lucide-react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Components
import Header from "@/components/layout/header"
import HeroSection from "@/components/sections/hero-section"
// import CategoryShowcase from "@/components/sections/category-showcase"
import ProductCard from "@/components/products/product-card"
import PromoBanner from "@/components/sections/promo-banner"
import BenefitsSection from "@/components/sections/benefits-section"
import TestimonialsSection from "@/components/sections/testimonials-section"
import CTASection from "@/components/sections/cta-section"
// import ProductCarousel from "@/components/ui/product-carousel"

async function getFeaturedProducts() {
	try {
		const response = await productAPI.getAll({
			limit: 8,
			sort: "is_featured.desc",
		})
		return response.data || []
	} catch (error) {
		console.error("Error fetching featured products:", error)
		return []
	}
}

async function getNewArrivals() {
	try {
		const response = await productAPI.getAll({
			limit: 4,
			sort: "created_at.desc",
		})
		return response.data || []
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
			<Header />
			{/* Hero Section */}
			<HeroSection
				title="Temukan Produk Berkualitas untuk"
				subtitle="Kebutuhan Anda"
				description="DRT-Store menyediakan berbagai pilihan produk berkualitas dengan harga terjangkau. Belanja sekarang dan dapatkan pengalaman berbelanja terbaik!"
				primaryButtonText="Belanja Sekarang"
				primaryButtonLink="/products"
				secondaryButtonText="Lihat Kategori"
				secondaryButtonLink="/categories"
				badgeText="Belanja Mudah, Kualitas Terjamin"
				imageSrc="/hero-image.png"
				imageAlt="DRT-Store Hero"
				overlayBadgeText="Produk Terbaik untuk Anda"
			/>

			{/* Category Showcase */}
			{/* <CategoryShowcase
				categories={categories}
				title="Kategori Unggulan"
				description="Temukan produk berdasarkan kategori kebutuhan Anda"
				viewAllUrl="/categories"
			/> */}

			{/* Featured Products */}
			<section className="py-12 bg-gray-50">
				<div className="container px-4 mx-auto">
					<div className="flex justify-between items-center mb-8">
						<div>
							<h2 className="text-2xl md:text-3xl font-bold">
								Produk Unggulan
							</h2>
							<p className="text-gray-600 mt-1">
								Produk terbaik dan paling diminati
							</p>
						</div>
						<Link
							href="/products?sort=is_featured.desc"
							className="text-primary inline-flex items-center hover:underline font-medium"
						>
							Lihat Semua
							<ArrowRight className="ml-1 h-4 w-4" />
						</Link>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
						{featuredProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
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
			<section className="py-12 bg-white">
				<div className="container px-4 mx-auto">
					<div className="flex justify-between items-center mb-8">
						<div>
							<h2 className="text-2xl md:text-3xl font-bold">Produk Terbaru</h2>
							<p className="text-gray-600 mt-1">
								Koleksi terbaru yang baru saja ditambahkan
							</p>
						</div>
						<Link
							href="/products?sort=created_at.desc"
							className="text-primary inline-flex items-center hover:underline font-medium"
						>
							Lihat Semua
							<ArrowRight className="ml-1 h-4 w-4" />
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{newArrivals.map((product) => (
							<ProductCard key={product.id} product={product} />
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
