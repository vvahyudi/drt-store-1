"use client"

import { memo, useRef } from "react"
import dynamic from "next/dynamic"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

// Lazy load TestimonialCard with skeleton loading
const TestimonialCard = dynamic(
	() => import("@/components/ui/testimonial-card"),
	{
		loading: () => (
			<div className="bg-white p-6 rounded-lg border border-gray-100 h-full w-full">
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
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" })
		}
	}

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" })
		}
	}

	return (
		<section className="py-16 bg-gray-50">
			<div className=" px-4 mx-auto">
				<div className="text-center mb-8">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
						Apa Kata Pelanggan Kami
					</h2>
					<p className="text-gray-600 mt-3 text-lg">
						Pengalaman berbelanja di DRT-Store
					</p>
				</div>

				<div className="relative">
					{/* Navigation buttons */}
					<button
						onClick={scrollLeft}
						className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none hidden md:block"
						aria-label="Scroll left"
					>
						<ChevronLeft className="h-6 w-6 text-gray-700" />
					</button>

					<button
						onClick={scrollRight}
						className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none hidden md:block"
						aria-label="Scroll right"
					>
						<ChevronRight className="h-6 w-6 text-gray-700" />
					</button>

					{/* Scrollable container */}
					<div
						ref={scrollContainerRef}
						className="flex overflow-x-auto gap-6 pb-6 px-2 snap-x snap-mandatory scrollbar-hide"
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						{testimonials.map((testimonial, index) => (
							<div
								key={`testimonial-${index}`}
								className="flex-none w-[85%] md:w-[500px] snap-start"
							>
								<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
									<div className="flex items-start">
										<div className="flex-shrink-0 mr-4">
											{testimonial.imageSrc ? (
												<img
													src={testimonial.imageSrc || "/placeholder.svg"}
													alt={testimonial.name}
													className="h-12 w-12 rounded-full object-cover"
												/>
											) : (
												<div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
													{testimonial.initials}
												</div>
											)}
										</div>
										<div className="flex-1">
											<div className="flex justify-between items-start">
												<div>
													<h4 className="font-semibold text-gray-900">
														{testimonial.name}
													</h4>
													<p className="text-sm text-gray-500">
														{testimonial.location}
													</p>
												</div>
												<div className="flex space-x-1">
													{[...Array(5)].map((_, i) => (
														<Star
															key={i}
															className={`h-4 w-4 ${
																i < testimonial.rating
																	? "text-yellow-400 fill-yellow-400"
																	: "text-gray-300"
															}`}
														/>
													))}
												</div>
											</div>
											<p className="mt-3 text-gray-700 leading-relaxed">
												"{testimonial.testimonial}"
											</p>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Scroll indicator for mobile */}
				<div className="flex justify-center mt-4 space-x-2 md:hidden">
					{testimonials.map((_, index) => (
						<div
							key={`indicator-${index}`}
							className="h-2 w-2 rounded-full bg-gray-300"
						/>
					))}
				</div>
			</div>
		</section>
	)
}

export default memo(TestimonialsSection)
