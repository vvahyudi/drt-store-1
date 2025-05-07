import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function Footer() {
	return (
		<footer className="bg-white border-t border-gray-100 mt-auto">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
					{/* Brand Section */}
					<div className="space-y-4">
						<div className="flex items-center">
							<Image
								src="/logo.png"
								alt="DRT-Store Logo"
								width={140}
								height={140}
								className="object-contain"
							/>
						</div>
						<p className="text-gray-500 text-sm">
							Toko online terpercaya untuk produk berkualitas dengan harga
							terjangkau.
						</p>
					</div>

					{/* Quick Links */}
					<div className="space-y-4">
						<h3 className="text-base font-medium text-gray-800">Tautan</h3>
						<ul className="space-y-2">
							{[
								{ name: "Beranda", href: "/" },
								{ name: "Produk", href: "/products" },
								{ name: "Kategori", href: "/categories" },
								{ name: "Hubungi Kami", href: "#" },
							].map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										className="text-gray-500 hover:text-primary text-sm transition-colors duration-200"
									>
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Contact & Newsletter */}
					<div className="space-y-4">
						<h3 className="text-base font-medium text-gray-800">Kontak</h3>
						<div className="space-y-2 text-sm text-gray-500">
							<p>drtstore.id@gmail.com</p>
							<p>+62 817-5753-345</p>
						</div>

						{/* Newsletter */}
						<div className="pt-2">
							<h4 className="text-sm font-medium text-gray-800 mb-2">
								Berlangganan
							</h4>
							<div className="flex">
								<input
									type="email"
									placeholder="Email Anda"
									className="px-3 py-2 text-sm border border-gray-200 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-full"
								/>
								<button className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90 transition-colors text-sm">
									Berlangganan
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="border-t border-gray-100 mt-8 pt-6 text-center space-y-2">
					<p className="text-gray-400 text-sm">
						&copy; {new Date().getFullYear()} DRT-Store. Hak Cipta Dilindungi.
					</p>
					<p className="text-gray-400 text-sm">
						Made with ❤️ by{" "}
						<a
							href="https://wa.me/6282336017798"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:text-primary/80 transition-colors"
						>
							ahmadwahyudi
						</a>
					</p>
				</div>
			</div>
		</footer>
	)
}
