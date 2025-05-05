import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function Footer() {
	return (
		<footer className="bg-gradient-to-b from-gray-50 to-gray-100 mt-auto border-t border-gray-200">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
					{/* Kolom Brand */}
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
						<p className="text-gray-600 text-sm leading-relaxed">
							Toko online terpercaya untuk produk berkualitas dengan harga
							terjangkau. Kami berkomitmen memberikan pengalaman belanja terbaik
							untuk Anda.
						</p>
						<div className="flex space-x-4 pt-2">
							{["facebook", "twitter", "instagram", "whatsapp"].map(
								(sosmed) => (
									<a
										key={sosmed}
										href="#"
										className="text-gray-500 hover:text-primary transition-colors duration-200"
										aria-label={`Ikuti kami di ${sosmed}`}
									>
										<div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
											<span className="sr-only">{sosmed}</span>
										</div>
									</a>
								),
							)}
						</div>
					</div>

					{/* Tautan Cepat */}
					<div>
						<h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
							Tautan Cepat
						</h3>
						<ul className="space-y-3">
							{[
								{ name: "Beranda", href: "/" },
								{ name: "Produk", href: "/products" },
								{ name: "Kategori", href: "/categories" },
							].map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										className="text-gray-600 hover:text-primary transition-colors duration-200 flex items-center group"
									>
										<ArrowRight className="h-3 w-3 mr-2 text-gray-400 group-hover:text-primary transition-colors" />
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Layanan Pelanggan */}
					<div>
						<h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
							Layanan Pelanggan
						</h3>
						<ul className="space-y-3">
							{[
								{ name: "Hubungi Kami", href: "#" },
								{ name: "FAQ", href: "#" },
								{ name: "Pengiriman", href: "#" },
								{ name: "Retur & Pengembalian", href: "#" },
								{ name: "Panduan Ukuran", href: "#" },
							].map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										className="text-gray-600 hover:text-primary transition-colors duration-200 flex items-center group"
									>
										<ArrowRight className="h-3 w-3 mr-2 text-gray-400 group-hover:text-primary transition-colors" />
										{link.name}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Info Kontak */}
					<div>
						<h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
							Hubungi Kami
						</h3>
						<ul className="space-y-3 text-gray-600">
							<li className="flex items-start">
								<svg
									className="h-5 w-5 text-primary mr-3 mt-0.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								<span>cs@drtstore.com</span>
							</li>
							<li className="flex items-start">
								<svg
									className="h-5 w-5 text-primary mr-3 mt-0.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									/>
								</svg>
								<span>+62 812 3456 7890</span>
							</li>
							<li className="flex items-start">
								<svg
									className="h-5 w-5 text-primary mr-3 mt-0.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								<span>
									Jl. Toko No. 123
									<br />
									Jakarta, Indonesia 12345
								</span>
							</li>
						</ul>

						{/* Newsletter */}
						<div className="mt-6">
							<h4 className="text-sm font-semibold text-gray-800 mb-2">
								Berlangganan Newsletter
							</h4>
							<div className="flex">
								<input
									type="email"
									placeholder="Alamat email Anda"
									className="px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-full"
								/>
								<button className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90 transition-colors text-sm font-medium">
									Daftar
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Hak Cipta */}
				<div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
					<p className="text-gray-500 text-sm">
						&copy; {new Date().getFullYear()} DRT-Store. Semua hak dilindungi.
					</p>
					<div className="flex space-x-6 mt-4 md:mt-0">
						<a
							href="/privacy"
							className="text-gray-500 hover:text-primary text-sm transition-colors"
						>
							Kebijakan Privasi
						</a>
						<a
							href="/terms"
							className="text-gray-500 hover:text-primary text-sm transition-colors"
						>
							Syarat & Ketentuan
						</a>
						<a
							href="/sitemap"
							className="text-gray-500 hover:text-primary text-sm transition-colors"
						>
							Peta Situs
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
