import { Star } from "lucide-react"

interface TestimonialCardProps {
	name: string
	location: string
	rating: number
	testimonial: string
	initials: string
	imageSrc?: string
}

export default function TestimonialCard({
	name,
	location,
	rating,
	testimonial,
	initials,
	imageSrc,
}: TestimonialCardProps) {
	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full">
			<div className="flex items-start">
				<div className="flex-shrink-0 mr-4">
					{imageSrc ? (
						<img
							src={imageSrc || "/placeholder.svg"}
							alt={name}
							className="h-12 w-12 rounded-full object-cover"
						/>
					) : (
						<div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
							{initials}
						</div>
					)}
				</div>
				<div className="flex-1">
					<div className="flex justify-between items-start">
						<div>
							<h4 className="font-semibold text-gray-900">{name}</h4>
							<p className="text-sm text-gray-500">{location}</p>
						</div>
						<div className="flex space-x-1">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={`h-4 w-4 ${
										i < rating
											? "text-yellow-400 fill-yellow-400"
											: "text-gray-300"
									}`}
								/>
							))}
						</div>
					</div>
					<p className="mt-3 text-gray-700 leading-relaxed">"{testimonial}"</p>
				</div>
			</div>
		</div>
	)
}
