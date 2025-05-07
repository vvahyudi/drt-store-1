// src/components/sections/promo-banner.tsx
import { memo } from "react"
import Link from "next/link"
import { Tag } from "lucide-react"
import { cn } from "@/lib/utils"

interface PromoItem {
	title: string
	subtitle: string
}

interface PromoBannerProps {
	title: string
	description: string
	buttonText: string
	buttonLink: string
	buttonIcon?: React.ReactNode
	promoItems?: PromoItem[]
	variant?: "primary" | "secondary" | "dark" | "gradient"
	className?: string
}

const variantStyles = {
	primary: {
		section: "bg-primary text-white",
		button:
			"bg-white text-primary hover:bg-white/90 focus-visible:ring-primary/50",
		promoBox: "bg-white/10 hover:bg-white/20 transition-colors",
	},
	secondary: {
		section: "bg-secondary text-white",
		button:
			"bg-white text-secondary hover:bg-white/90 focus-visible:ring-secondary/50",
		promoBox: "bg-white/10 hover:bg-white/20 transition-colors",
	},
	dark: {
		section: "bg-gray-900 text-white",
		button:
			"bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary/50",
		promoBox: "bg-white/10 hover:bg-white/20 transition-colors",
	},
	gradient: {
		section: "bg-gradient-to-r from-primary to-secondary text-white",
		button:
			"bg-white text-primary hover:bg-white/90 focus-visible:ring-primary/50",
		promoBox: "bg-white/10 hover:bg-white/20 transition-colors",
	},
}

function PromoBanner({
	title,
	description,
	buttonText,
	buttonLink,
	buttonIcon,
	promoItems = [],
	variant = "primary",
	className,
}: PromoBannerProps) {
	const styles = variantStyles[variant] || variantStyles.primary

	return (
		<section className={cn("py-16", styles.section, className)}>
			<div className=" px-4 mx-auto">
				<div className="flex flex-col lg:flex-row items-center gap-8">
					<div className="lg:w-1/2 space-y-4">
						<h2 className="text-3xl md:text-4xl font-bold leading-tight">
							{title}
						</h2>
						<p className="text-white/90 text-lg">{description}</p>
						<Link
							href={buttonLink}
							className={cn(
								"py-3 px-8 rounded-lg inline-flex items-center font-medium transition-colors",
								"focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2",
								"text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300",
								styles.button,
							)}
							aria-label={buttonText}
						>
							{buttonIcon || <Tag className="mr-3 h-5 w-5" />}
							{buttonText}
						</Link>
					</div>

					{promoItems.length > 0 && (
						<div className="lg:w-1/2 w-full lg:pl-8">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{promoItems.map((item, index) => (
									<div
										key={`promo-item-${index}`}
										className={cn(
											"p-6 rounded-xl cursor-default",
											styles.promoBox,
										)}
									>
										<div className="text-white text-3xl font-bold mb-1">
											{item.title}
										</div>
										<div className="text-white/80 text-sm">{item.subtitle}</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}

export default memo(PromoBanner)
