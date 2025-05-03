// src/components/sections/benefits-section.tsx
import { memo } from "react"
import dynamic from "next/dynamic"
import {
	ShieldCheck,
	Truck,
	RefreshCw,
	Star,
	Headphones,
	CreditCard,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// Lazy load BenefitCard to improve initial load performance
const BenefitCard = dynamic(() => import("../ui/benefit-card"), {
	loading: () => <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />,
})

interface Benefit {
	icon: LucideIcon
	title: string
	description: string
}

const benefits: Benefit[] = [
	{
		icon: ShieldCheck,
		title: "Kualitas Terjamin",
		description:
			"Semua produk kami melewati quality control yang ketat untuk memastikan kualitas terbaik.",
	},
	{
		icon: Truck,
		title: "Pengiriman Cepat",
		description:
			"Kami bekerja sama dengan jasa pengiriman terpercaya untuk memastikan produk sampai tepat waktu.",
	},
	{
		icon: RefreshCw,
		title: "Garansi Pengembalian",
		description:
			"Jika produk tidak sesuai, kami memberikan garansi pengembalian dalam 7 hari.",
	},
	{
		icon: Headphones,
		title: "Layanan Pelanggan",
		description:
			"Tim layanan pelanggan kami siap membantu Anda 24/7 untuk menjawab semua pertanyaan.",
	},
	{
		icon: CreditCard,
		title: "Pembayaran Aman",
		description:
			"Berbagai metode pembayaran yang aman dan terpercaya untuk kenyamanan Anda.",
	},
	{
		icon: Star,
		title: "Produk Berkualitas",
		description:
			"Kami hanya menjual produk dengan kualitas terbaik dan terjamin keasliannya.",
	},
]

function BenefitsSection() {
	return (
		<section className="py-16 bg-gradient-to-b from-gray-50 to-white">
			<div className="container px-4 mx-auto max-w-7xl">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
						Mengapa Memilih DRT-Store?
					</h2>
					<p className="text-gray-600 mt-3 max-w-2xl mx-auto text-lg">
						Kami berkomitmen memberikan pengalaman belanja terbaik
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
					{benefits.map((benefit, index) => (
						<BenefitCard
							key={`benefit-${index}`}
							icon={benefit.icon}
							title={benefit.title}
							description={benefit.description}
						/>
					))}
				</div>
			</div>
		</section>
	)
}

export default memo(BenefitsSection)
