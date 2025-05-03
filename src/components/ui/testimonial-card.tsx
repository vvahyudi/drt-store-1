// src/components/ui/testimonial-card.tsx
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface TestimonialCardProps {
	name: string
	location: string
	rating: number
	testimonial: string
	initials: string
	imageSrc?: string
	className?: string
}

export default function TestimonialCard({
	name,
	location,
	rating,
	testimonial,
	initials,
	imageSrc,
	className,
}: TestimonialCardProps) {
	return (
		<div
			className={cn(
				"bg-white p-6 rounded-xl border border-gray-100",
				"hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
				"h-full flex flex-col",
				className,
			)}
		>
			<div className="flex items-center mb-4">
				<div className="mr-3">
					{imageSrc ? (
						<img
							src={imageSrc}
							alt={name}
							className="w-12 h-12 rounded-full object-cover"
							loading="lazy"
						/>
					) : (
						<div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-medium">
							{initials}
						</div>
					)}
				</div>
				<div>
					<div className="font-medium text-gray-900">{name}</div>
					<div className="text-sm text-gray-500">{location}</div>
				</div>
			</div>
			<div className="flex mb-4">
				{Array.from({ length: 5 }).map((_, i) => (
					<Star
						key={i}
						className={`h-5 w-5 ${
							i < rating ? "text-yellow-400 fill-current" : "text-gray-200"
						}`}
					/>
				))}
			</div>
			<blockquote className="text-gray-600 flex-grow">
				<p className="before:content-[\u201C] after:content-[\u201D] italic">
					{testimonial}
				</p>
			</blockquote>
		</div>
	)
}
