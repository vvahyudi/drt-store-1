// src/components/layout/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
	LayoutDashboard,
	ShoppingBag,
	FolderTree,
	ShoppingCart,
	Settings,
	LogOut,
	ChevronDown,
	ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { signOut } from "next-auth/react"

const sidebarLinks = [
	{
		label: "Dashboard",
		href: "/admin/dashboard",
		icon: LayoutDashboard,
	},
	{
		label: "Products",
		href: "/admin/products",
		icon: ShoppingBag,
		subLinks: [
			{ label: "All Products", href: "/admin/products" },
			{ label: "Add Product", href: "/admin/products/create" },
		],
	},
	{
		label: "Categories",
		href: "/admin/categories",
		icon: FolderTree,
		subLinks: [
			{ label: "All Categories", href: "/admin/categories" },
			{ label: "Add Category", href: "/admin/categories/create" },
		],
	},
	{
		label: "Orders",
		href: "/admin/orders",
		icon: ShoppingCart,
	},
	{
		label: "Settings",
		href: "/admin/settings",
		icon: Settings,
	},
]

export default function Sidebar() {
	const pathname = usePathname()
	const [expandedSection, setExpandedSection] = useState<string | null>(null)

	const toggleSection = (label: string) => {
		if (expandedSection === label) {
			setExpandedSection(null)
		} else {
			setExpandedSection(label)
		}
	}

	return (
		<div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-md py-6 overflow-y-auto">
			<div className="px-6 mb-6">
				<Link href="/" className="text-xl font-bold">
					DRT-Store Admin
				</Link>
			</div>

			<nav className="space-y-1 px-3">
				{sidebarLinks.map((link) => {
					const Icon = link.icon
					const isActive =
						pathname === link.href || pathname.startsWith(link.href + "/")
					const isExpanded = expandedSection === link.label

					return (
						<div key={link.label}>
							<div
								className={cn(
									"flex items-center justify-between px-3 py-2 rounded-md cursor-pointer",
									isActive ? "bg-primary/10 text-primary" : "hover:bg-gray-100",
								)}
								onClick={() =>
									link.subLinks ? toggleSection(link.label) : null
								}
							>
								<Link
									href={link.href}
									className="flex items-center flex-grow"
									onClick={(e) => link.subLinks && e.preventDefault()}
								>
									<Icon className="w-5 h-5 mr-3" />
									<span className="text-sm font-medium">{link.label}</span>
								</Link>

								{link.subLinks && (
									<button
										onClick={(e) => {
											e.stopPropagation()
											toggleSection(link.label)
										}}
										className="p-1"
									>
										{isExpanded ? (
											<ChevronUp className="w-4 h-4" />
										) : (
											<ChevronDown className="w-4 h-4" />
										)}
									</button>
								)}
							</div>

							{link.subLinks && isExpanded && (
								<div className="pl-11 py-1 space-y-1">
									{link.subLinks.map((subLink) => {
										const isSubActive = pathname === subLink.href

										return (
											<Link
												key={subLink.href}
												href={subLink.href}
												className={cn(
													"block py-2 px-3 rounded-md text-sm",
													isSubActive
														? "bg-primary/10 text-primary"
														: "text-gray-600 hover:bg-gray-100",
												)}
											>
												{subLink.label}
											</Link>
										)
									})}
								</div>
							)}
						</div>
					)
				})}
			</nav>

			<div className="px-6 mt-auto pt-6 border-t">
				<button
					onClick={() => signOut()}
					className="flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-gray-100 w-full"
				>
					<LogOut className="w-5 h-5 mr-3" />
					Sign Out
				</button>
			</div>
		</div>
	)
}
