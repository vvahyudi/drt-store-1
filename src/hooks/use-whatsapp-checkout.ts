import { CartItem } from "@/types/api"

interface CustomerInfo {
	name: string
	phone: string
	address: string
}

export const useWhatsappCheckout = () => {
	const createCheckoutLink = (
		items: CartItem[],
		customerInfo: CustomerInfo,
	) => {
		// Use store's WhatsApp number
		const storePhone = process.env.NEXT_PUBLIC_STORE_WHATSAPP || "6281234567890"

		// Get base URL for product links
		const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

		// Create product list message with links
		const productList = items
			.map(
				(item) =>
					`- ${item.product.name} (${item.quantity}x)${
						item.selected_variants
							? ` - ${Object.values(item.selected_variants).join(", ")}`
							: ""
					}
   Link: ${baseUrl}/product/${item.product.slug}`,
			)
			.join("\n\n")

		// Calculate total
		const total = items.reduce(
			(sum, item) => sum + item.product.price * item.quantity,
			0,
		)

		// Create message
		const message = `Halo, saya ingin memesan produk berikut:

${productList}

Total: Rp ${total.toLocaleString("id-ID")}

Data Pemesan:
Nama: ${customerInfo.name}
No. Telepon: ${customerInfo.phone}
Alamat: ${customerInfo.address}

Terima kasih!`

		// Create WhatsApp URL
		const whatsappUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(
			message,
		)}`

		return whatsappUrl
	}

	return {
		createCheckoutLink,
	}
}
