// src/app/(shop)/checkout/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ShoppingBag, Check, ArrowRight } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { useWhatsappCheckout } from "@/hooks/use-whatsapp-checkout"
import { toast } from "sonner"

// Define form schema
const checkoutSchema = z.object({
	name: z.string().min(2, "Nama harus diisi"),
	phone: z.string().min(10, "Nomor telepon harus diisi"),
	address: z.string().min(5, "Alamat harus diisi"),
	notes: z.string().optional(),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
	const router = useRouter()
	const { items, total, clearCart } = useCart()
	const { createCheckoutLink } = useWhatsappCheckout()
	const [isLoading, setIsLoading] = useState(false)
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CheckoutFormValues>({
		resolver: zodResolver(checkoutSchema),
		defaultValues: {
			name: "",
			phone: "",
			address: "",
			notes: "",
		},
	})

	// Redirect to cart if it's empty
	// Redirect to cart if it's empty
	useEffect(() => {
		if (isMounted && items.length === 0) {
			router.replace("/cart")
		}
	}, [items.length, router, isMounted])

	const onSubmit = async (data: CheckoutFormValues) => {
		setIsLoading(true)

		try {
			// Create WhatsApp checkout link
			const checkoutLink = createCheckoutLink(items, {
				name: data.name,
				phone: data.phone,
				address: data.address + (data.notes ? `\nCatatan: ${data.notes}` : ""),
			})

			// Clear the cart
			clearCart()

			// Redirect to WhatsApp
			window.location.href = checkoutLink
		} catch (error) {
			console.error("Checkout error:", error)
			toast.error("Gagal membuat link checkout. Silakan coba lagi.")
		} finally {
			setIsLoading(false)
		}
	}

	// Show loading state while checking cart
	if (items.length === 0) {
		return (
			<div className="container px-4 mx-auto py-8">
				<div className="text-center">
					<p>Mengarahkan ke keranjang...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="container px-4 mx-auto py-8">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">Checkout</h1>
				<Link
					href="/cart"
					className="flex items-center text-gray-600 hover:text-gray-900"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Kembali ke Keranjang
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				<div className="md:col-span-2">
					<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
						<h2 className="text-xl font-bold mb-4">Informasi Pengiriman</h2>

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Nama Lengkap
								</label>
								<input
									id="name"
									{...register("name")}
									className="w-full p-2 border rounded-md"
									placeholder="Masukkan nama lengkap"
									disabled={isLoading}
								/>
								{errors.name && (
									<p className="text-red-500 text-xs mt-1">
										{errors.name.message}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="phone"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Nomor Telepon
								</label>
								<input
									id="phone"
									{...register("phone")}
									className="w-full p-2 border rounded-md"
									placeholder="Masukkan nomor telepon"
									disabled={isLoading}
								/>
								{errors.phone && (
									<p className="text-red-500 text-xs mt-1">
										{errors.phone.message}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="address"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Alamat Pengiriman
								</label>
								<textarea
									id="address"
									{...register("address")}
									rows={3}
									className="w-full p-2 border rounded-md"
									placeholder="Masukkan alamat lengkap"
									disabled={isLoading}
								></textarea>
								{errors.address && (
									<p className="text-red-500 text-xs mt-1">
										{errors.address.message}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="notes"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									Catatan (Opsional)
								</label>
								<textarea
									id="notes"
									{...register("notes")}
									rows={2}
									className="w-full p-2 border rounded-md"
									placeholder="Catatan tambahan untuk pesanan"
									disabled={isLoading}
								></textarea>
							</div>

							<div className="bg-blue-50 p-4 rounded-md">
								<h3 className="font-medium mb-2">Cara Checkout</h3>
								<p className="text-sm text-gray-600">
									Setelah mengisi form, Anda akan diarahkan ke WhatsApp untuk
									menyelesaikan pesanan. Tim kami akan menghubungi Anda untuk
									detail pembayaran dan pengiriman.
								</p>
							</div>

							<button
								type="submit"
								className="bg-primary text-white py-3 px-4 rounded-md w-full flex items-center justify-center font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
								disabled={isLoading}
							>
								{isLoading ? (
									<span>Memproses...</span>
								) : (
									<>
										Lanjutkan ke WhatsApp
										<ArrowRight className="ml-2 h-4 w-4" />
									</>
								)}
							</button>
						</form>
					</div>
				</div>

				<div>
					<div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
						<h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>

						<div className="space-y-4 mb-4">
							<div className="max-h-64 overflow-y-auto">
								{items.map((item) => (
									<div
										key={`${item.product.id}-${JSON.stringify(
											item.selected_variants,
										)}`}
										className="flex justify-between py-2 border-b"
									>
										<div className="flex-1">
											<div className="font-medium">{item.product.name}</div>
											<div className="text-sm text-gray-500 flex items-center">
												<span>Jumlah: {item.quantity}</span>
												{item.selected_variants &&
													Object.keys(item.selected_variants).length > 0 && (
														<span className="ml-2">
															(
															{Object.values(item.selected_variants).join(", ")}
															)
														</span>
													)}
											</div>
										</div>
										<div className="text-right">
											{formatPrice(item.product.price * item.quantity)}
										</div>
									</div>
								))}
							</div>

							<div className="flex justify-between text-gray-600">
								<span>Subtotal</span>
								<span>{formatPrice(total)}</span>
							</div>

							<div className="flex justify-between text-gray-600">
								<span>Pengiriman</span>
								<span>Akan dihitung</span>
							</div>

							<div className="border-t my-2 pt-2"></div>

							<div className="flex justify-between font-bold text-lg">
								<span>Total</span>
								<span>{formatPrice(total)}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
