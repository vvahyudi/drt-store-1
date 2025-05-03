// src/components/ui/benefit-card.tsx
import { LucideIcon } from "lucide-react"

interface BenefitCardProps {
	icon: LucideIcon
	title: string
	description: string
	iconBgColor?: string
	iconColor?: string
}

export default function BenefitCard({
	icon: Icon,
	title,
	description,
	iconBgColor = "bg-blue-50",
	iconColor = "text-primary",
}: BenefitCardProps) {
	return (
		<div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
			<div className={`${iconBgColor} p-3 rounded-full inline-block mb-4`}>
				<Icon className={`h-8 w-8 ${iconColor}`} />
			</div>
			<h3 className="text-lg font-bold mb-2">{title}</h3>
			<p className="text-gray-600">{description}</p>
		</div>
	)
}
