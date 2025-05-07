// src/components/sections/hero-section.tsx
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
	title: string
	subtitle: string
	description: string
	primaryButtonText: string
	primaryButtonLink: string
	secondaryButtonText?: string
	secondaryButtonLink?: string
	badgeText?: string
	imageSrc: string
	imageAlt: string
	overlayBadgeText?: string
	variant?: "default" | "centered" | "reverse"
	className?: string
}

export default function HeroSection({
	title,
	subtitle,
	description,
	primaryButtonText,
	primaryButtonLink,
	secondaryButtonText,
	secondaryButtonLink,
	badgeText,
	imageSrc,
	imageAlt,
	overlayBadgeText,
	variant = "default",
	className,
}: HeroSectionProps) {
	return (
		<section
			className={cn(
				"py-12 md:py-20 bg-gradient-to-r from-blue-50 to-indigo-50",
				className,
			)}
		>
			<div className=" px-4 mx-auto">
				<div
					className={cn(
						"flex flex-col gap-8",
						variant === "default" && "md:flex-row items-center justify-between",
						variant === "centered" && "items-center text-center",
						variant === "reverse" &&
							"md:flex-row-reverse items-center justify-between",
					)}
				>
					<div
						className={cn(
							variant === "centered" ? "max-w-2xl mx-auto" : "md:w-1/2",
							"mb-8 md:mb-0",
						)}
					>
						{badgeText && (
							<div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
								{badgeText}
							</div>
						)}

						<h1
							className={cn(
								"text-4xl md:text-5xl font-bold mb-4 leading-tight",
								variant === "centered" && "text-center",
							)}
						>
							{title} <span className="text-primary">{subtitle}</span>
						</h1>

						<p
							className={cn(
								"text-lg text-gray-600 mb-6",
								variant === "centered" && "text-center",
							)}
						>
							{description}
						</p>

						<div
							className={cn(
								"flex gap-4",
								variant === "centered" ? "justify-center" : "",
								"flex-col sm:flex-row",
							)}
						>
							<Link
								href={primaryButtonLink}
								className="bg-primary text-white py-3 px-6 rounded-md inline-flex items-center justify-center font-medium hover:bg-primary/90 transition-colors"
							>
								<ShoppingBag className="mr-2 h-5 w-5" />
								{primaryButtonText}
							</Link>

							{secondaryButtonText && secondaryButtonLink && (
								<Link
									href={secondaryButtonLink}
									className="bg-white text-gray-800 border border-gray-300 py-3 px-6 rounded-md inline-flex items-center justify-center font-medium hover:bg-gray-50 transition-colors"
								>
									{secondaryButtonText}
								</Link>
							)}
						</div>
					</div>

					{variant !== "centered" && (
						<div className="md:w-1/2">
							<div className="relative rounded-lg overflow-hidden shadow-xl">
								<Image
									src={imageSrc}
									alt={imageAlt}
									width={600}
									height={400}
									className="object-cover w-full h-[300px] md:h-[400px]"
									priority
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

								{overlayBadgeText && (
									<div className="absolute bottom-0 left-0 p-6 text-white">
										<div className="flex items-center bg-primary/80 px-4 py-2 rounded-full text-sm font-medium">
											<Star className="h-4 w-4 mr-1 text-yellow-300" />
											{overlayBadgeText}
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}

// Contoh penggunaan dalam page.tsx:
/*
<HeroSection
  title="Temukan Produk Berkualitas untuk"
  subtitle="Kebutuhan Anda"
  description="DRT-Store menyediakan berbagai pilihan produk berkualitas dengan harga terjangkau. Belanja sekarang dan dapatkan pengalaman berbelanja terbaik!"
  primaryButtonText="Belanja Sekarang"
  primaryButtonLink="/products"
  secondaryButtonText="Lihat Kategori"
  secondaryButtonLink="/categories"
  badgeText="Belanja Mudah, Kualitas Terjamin"
  imageSrc="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  imageAlt="DRT-Store Hero"
  overlayBadgeText="Produk Terbaik untuk Anda"
/>
*/
