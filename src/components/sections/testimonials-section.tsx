// src/components/sections/testimonials-section.tsx
import { memo } from "react"
import dynamic from "next/dynamic"
import { Star } from "lucide-react"

// Lazy load TestimonialCard with skeleton loading
const TestimonialCard = dynamic(
	() => import("@/components/ui/testimonial-card"),
	{
		loading: () => (
			<div className="bg-gray-50 p-6 rounded-lg border border-gray-100 h-full">
				<div className="animate-pulse space-y-4">
					<div className="flex items-center space-x-3">
						<div className="h-12 w-12 rounded-full bg-gray-200"></div>
						<div className="space-y-2">
							<div className="h-4 w-24 bg-gray-200 rounded"></div>
							<div className="h-3 w-16 bg-gray-200 rounded"></div>
						</div>
					</div>
					<div className="flex space-x-1">
						{[...Array(5)].map((_, i) => (
							<Star key={i} className="h-4 w-4 text-gray-300" />
						))}
					</div>
					<div className="space-y-2">
						<div className="h-3 bg-gray-200 rounded"></div>
						<div className="h-3 bg-gray-200 rounded"></div>
						<div className="h-3 w-3/4 bg-gray-200 rounded"></div>
					</div>
				</div>
			</div>
		),
	},
)

interface Testimonial {
	name: string
	location: string
	rating: number
	testimonial: string
	initials: string
	imageSrc?: string
}

const testimonials: Testimonial[] = [
	{
		name: "Andi Saputra",
		location: "Jakarta",
		rating: 5,
		testimonial:
			"Pengalaman belanja yang menyenangkan. Produk berkualitas dan pengiriman cepat. Pasti akan berbelanja lagi di sini!",
		initials: "AS",
	},
	{
		name: "Dewi Pratiwi",
		location: "Surabaya",
		rating: 5,
		testimonial:
			"Saya sangat puas dengan layanan DRT-Store. Produk sesuai deskripsi dan harga sangat bersaing. Recommended!",
		initials: "DP",
	},
	{
		name: "Budi Prasetyo",
		location: "Bandung",
		rating: 5,
		testimonial:
			"Proses checkout sangat mudah dan cepat. Produk dikirim dengan aman dan sesuai jadwal. Sangat memuaskan!",
		initials: "BP",
	},
	{
		name: "Siti Nurhaliza",
		location: "Yogyakarta",
		rating: 4,
		testimonial:
			"Produk berkualitas baik dan sesuai dengan deskripsi. Pengiriman sedikit terlambat tapi layanan customer service sangat responsif.",
		initials: "SN",
	},
]

function TestimonialsSection() {
	return (
		<section className="py-16 bg-gray-50">
			<div className="container px-4 mx-auto max-w-7xl">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
						Apa Kata Pelanggan Kami
					</h2>
					<p className="text-gray-600 mt-3 text-lg">
						Pengalaman berbelanja di DRT-Store
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{testimonials.map((testimonial, index) => (
						<TestimonialCard key={`testimonial-${index}`} {...testimonial} />
					))}
				</div>
			</div>
		</section>
	)
}

export default memo(TestimonialsSection)
