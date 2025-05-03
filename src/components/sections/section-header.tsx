import { ReactNode } from "react"

interface SectionHeaderProps {
	title: string
	description?: string
	icon?: ReactNode
	children?: ReactNode
}

export default function SectionHeader({
	title,
	description,
	icon,
	children,
}: SectionHeaderProps) {
	return (
		<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
			<div className="flex items-center gap-3">
				{icon && (
					<div className="p-2 rounded-lg bg-white shadow-sm">{icon}</div>
				)}
				<div>
					<h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
					{description && <p className="text-gray-600 mt-1">{description}</p>}
				</div>
			</div>
			{children && <div className="flex items-center">{children}</div>}
		</div>
	)
}
