import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface BenefitCardProps {
	icon: LucideIcon
	title: string
	description: string
}

export default function BenefitCard({
	icon: Icon,
	title,
	description,
}: BenefitCardProps) {
	return (
		<Card className="h-full shadow-lg border-none bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
			<CardHeader className="pb-2">
				<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
					<Icon className="h-6 w-6 text-primary" />
				</div>
				<h3 className="text-xl font-bold text-gray-900">{title}</h3>
			</CardHeader>
			<CardContent>
				<p className="text-gray-600">{description}</p>
			</CardContent>
		</Card>
	)
}
