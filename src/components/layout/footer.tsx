export default function Footer() {
	return (
		<footer className="bg-gray-100 mt-auto">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<h3 className="font-bold text-lg mb-4">DRT-Store</h3>
						<p className="text-sm text-gray-600">
							Your one-stop shop for quality products at affordable prices.
						</p>
					</div>

					<div>
						<h3 className="font-bold text-lg mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="/"
									className="text-sm text-gray-600 hover:text-gray-900"
								>
									Home
								</a>
							</li>
							<li>
								<a
									href="/products"
									className="text-sm text-gray-600 hover:text-gray-900"
								>
									Products
								</a>
							</li>
							<li>
								<a
									href="/categories"
									className="text-sm text-gray-600 hover:text-gray-900"
								>
									Categories
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-bold text-lg mb-4">Contact Us</h3>
						<ul className="space-y-2">
							<li className="text-sm text-gray-600">
								Email: contact@drtstore.com
							</li>
							<li className="text-sm text-gray-600">
								Phone: +1 (123) 456-7890
							</li>
							<li className="text-sm text-gray-600">
								Address: 123 Store Street, City, Country
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-gray-200 mt-8 pt-8 text-center">
					<p className="text-sm text-gray-600">
						&copy; {new Date().getFullYear()} DRT-Store. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}
