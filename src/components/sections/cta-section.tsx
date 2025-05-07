// src/components/sections/cta-section.tsx
import { memo } from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

interface CTASectionProps {
	title: string
	description: string
	buttonText: string
	buttonLink: string
	buttonIcon?: React.ReactNode
	variant?: "gradient" | "primary" | "dark" | "secondary"
	className?: string
}

const variantStyles = {
	gradient: {
		section: "bg-gradient-to-r from-primary to-blue-600 text-white",
		button: "bg-white text-primary hover:bg-gray-50 shadow-lg hover:shadow-xl",
	},
	primary: {
		section: "bg-primary text-white",
		button: "bg-white text-primary hover:bg-gray-50 shadow-lg hover:shadow-xl",
	},
	secondary: {
		section: "bg-secondary text-white",
		button:
			"bg-white text-secondary hover:bg-gray-50 shadow-lg hover:shadow-xl",
	},
	dark: {
		section: "bg-gray-900 text-white",
		button:
			"bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl",
	},
}

function CTASection({
	title,
	description,
	buttonText,
	buttonLink,
	buttonIcon,
	variant = "gradient",
	className,
}: CTASectionProps) {
	const styles = variantStyles[variant] || variantStyles.gradient

	return (
		<section className={cn("py-16 md:py-20", styles.section, className)}>
			<div className="px-4 mx-auto text-center">
				<div className="space-y-6">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
						{title}
					</h2>
					<p className="text-lg md:text-xl text-white/90 px-20 mx-auto">
						{description}
					</p>
					<div>
						<Link
							href={buttonLink}
							className={cn(
								"py-4 px-10 rounded-lg inline-flex items-center font-medium transition-all duration-300",
								"transform hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50",
								"text-lg md:text-xl",
								styles.button,
							)}
							aria-label={buttonText}
						>
							{buttonIcon || <ShoppingBag className="mr-3 h-6 w-6" />}
							{buttonText}
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}

export default memo(CTASection)
