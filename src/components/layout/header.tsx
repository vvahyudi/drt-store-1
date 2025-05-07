"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
	ShoppingCart,
	Menu,
	X,
	User,
	LogOut,
	Search,
	ChevronDown,
	Home,
	Package,
	Tag,
	LayoutDashboard,
	Settings,
	ShoppingBag,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState("")
	const [isScrolled, setIsScrolled] = useState(false)
	const pathname = usePathname()
	const router = useRouter()
	const { data: session } = useSession()
	const { items } = useCart()

	const isAdmin = pathname.startsWith("/admin")
	const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0)

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10)
		}
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
			setIsMenuOpen(false)
		}
	}

	const navLinks = [
		{ href: "/", label: "Beranda", icon: Home },
		{ href: "/products", label: "Produk", icon: Package },
		{ href: "/categories", label: "Kategori", icon: Tag },
	]

	const adminLinks = [
		{ href: "/admin/dashboard", label: "Dasbor", icon: LayoutDashboard },
		{ href: "/admin/products", label: "Produk", icon: Package },
		{ href: "/admin/categories", label: "Kategori", icon: Tag },
		{ href: "/admin/orders", label: "Pesanan", icon: ShoppingBag },
		{ href: "/admin/settings", label: "Pengaturan", icon: Settings },
	]

	const activeLinks = isAdmin ? adminLinks : navLinks

	return (
		<header
			className={cn(
				"sticky top-0 z-50 transition-all duration-300 border-b",
				isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white",
			)}
		>
			<div className="container px-4 mx-auto">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center"
						onClick={() => setIsMenuOpen(false)}
					>
						<Image
							src="/logo.png"
							alt="DRT-Store Logo"
							width={150}
							height={150}
							className="object-contain"
						/>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-6">
						{activeLinks.map((link) => {
							const Icon = link.icon
							return (
								<Link
									key={link.href}
									href={link.href}
									className={cn(
										"flex items-center gap-2 text-sm font-medium transition-colors relative group py-1",
										pathname === link.href
											? "text-primary"
											: "text-gray-600 hover:text-primary",
									)}
								>
									<Icon className="w-5 h-5" />
									{link.label}
									<span
										className={cn(
											"absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
											pathname === link.href && "w-full",
										)}
									/>
								</Link>
							)
						})}
					</nav>

					{/* Right Side Actions */}
					<div className="hidden md:flex items-center gap-4">
						{!isAdmin && (
							<>
								<form onSubmit={handleSearch} className="relative">
									<input
										type="text"
										placeholder="Cari produk..."
										className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all w-64"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								</form>

								<Link
									href="/cart"
									className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors"
								>
									<ShoppingCart className="w-6 h-6 text-gray-700" />
									{cartItemsCount > 0 && (
										<span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
											{cartItemsCount}
										</span>
									)}
								</Link>
							</>
						)}

						{session && (
							<div className="relative group">
								<button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
									<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
										{session.user?.username?.charAt(0).toUpperCase()}
									</div>
								</button>
								<div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-1 hidden group-hover:block border border-gray-100">
									<div className="px-4 py-3 border-b">
										<p className="text-sm font-medium">
											{session.user.username}
										</p>
										<p className="text-xs text-gray-500">
											{session.user.username}
										</p>
									</div>
									{!isAdmin && (
										<Link
											href="/admin/dashboard"
											className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
										>
											<LayoutDashboard className="w-4 h-4" />
											Dasbor Admin
										</Link>
									)}
									<button
										onClick={() => signOut()}
										className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
									>
										<LogOut className="w-4 h-4" />
										Keluar
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Mobile Toggle */}
					<div className="flex md:hidden items-center gap-4">
						{!isAdmin && (
							<button
								onClick={() => router.push("/cart")}
								className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors"
							>
								<ShoppingCart className="w-6 h-6 text-gray-700" />
								{cartItemsCount > 0 && (
									<span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
										{cartItemsCount}
									</span>
								)}
							</button>
						)}
						<button
							className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							{isMenuOpen ? (
								<X className="w-6 h-6 text-gray-700" />
							) : (
								<Menu className="w-6 h-6 text-gray-700" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
						className="md:hidden bg-white border-t shadow-lg"
					>
						<div className="container px-4 py-4">
							<form onSubmit={handleSearch} className="mb-4">
								<div className="relative">
									<input
										type="text"
										placeholder="Cari produk..."
										className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								</div>
							</form>

							<nav className="flex flex-col gap-1">
								{activeLinks.map((link) => {
									const Icon = link.icon
									return (
										<Link
											key={link.href}
											href={link.href}
											className={cn(
												"flex items-center gap-3 text-sm font-medium py-3 px-4 rounded-lg transition-colors",
												pathname === link.href
													? "text-primary bg-primary/10"
													: "text-gray-700 hover:bg-gray-50",
											)}
											onClick={() => setIsMenuOpen(false)}
										>
											<Icon className="w-5 h-5" />
											{link.label}
										</Link>
									)
								})}

								{session && (
									<>
										<div className="border-t my-2"></div>
										{!isAdmin && (
											<Link
												href="/admin/dashboard"
												className="flex items-center gap-3 text-sm font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
												onClick={() => setIsMenuOpen(false)}
											>
												<LayoutDashboard className="w-5 h-5" />
												Dasbor Admin
											</Link>
										)}
										<button
											onClick={() => {
												signOut()
												setIsMenuOpen(false)
											}}
											className="flex items-center gap-3 text-sm font-medium py-3 px-4 rounded-lg text-red-600 hover:bg-gray-50 transition-colors"
										>
											<LogOut className="w-5 h-5" />
											Keluar
										</button>
									</>
								)}
							</nav>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	)
}

export default Header
