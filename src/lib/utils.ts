// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price)
}

export function truncate(str: string, length: number) {
	if (str.length <= length) return str
	return str.slice(0, length) + "..."
}

export function generateSlug(text: string) {
	return text
		.toString()
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/--+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "")
}

export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) return error.message
	return String(error)
}

// Create dates in ISO format for consistent backend handling
export function toISODateString(date: Date): string {
	return date.toISOString()
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount)
}
