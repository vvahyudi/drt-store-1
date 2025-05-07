"use client"

import { useState } from "react"
import type { Product, Category } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Loader2, Plus, Trash2, Upload } from "lucide-react"
import { productAPI } from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useCategories, useCategoryById } from "@/hooks/use-categories"

interface ProductFormProps {
	product: Product | null
	onSuccess: () => void
	onCancel: () => void
}

export default function ProductForm({
	product,
	onSuccess,
	onCancel,
}: ProductFormProps) {
	const { data: categoriesResponse, isLoading: isLoadingCategories } =
		useCategories()
	const categories = categoriesResponse?.data || []
	const [selectedCategory, setSelectedCategory] = useState<string>(
		product?.category_id || "",
	)
	const { data: selectedCategoryData } = useCategoryById(selectedCategory)
	const [images, setImages] = useState<File[]>([])
	const [previewUrls, setPreviewUrls] = useState<string[]>(
		product?.images?.map((img) => img.url) || [],
	)
	const [isLoading, setIsLoading] = useState(false)

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || [])
		setImages((prev) => [...prev, ...files])

		// Create preview URLs
		const newPreviewUrls = files.map((file) => URL.createObjectURL(file))
		setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
	}

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index))
		setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const formData = new FormData()
			const form = e.currentTarget

			// Add basic product data
			const nameInput = form.querySelector<HTMLInputElement>('[name="name"]')
			const descriptionInput = form.querySelector<HTMLTextAreaElement>(
				'[name="description"]',
			)
			const priceInput = form.querySelector<HTMLInputElement>('[name="price"]')
			const stockInput = form.querySelector<HTMLInputElement>('[name="stock"]')

			if (nameInput) formData.append("name", nameInput.value)
			if (descriptionInput)
				formData.append("description", descriptionInput.value)
			if (priceInput) formData.append("price", priceInput.value)
			formData.append("category_id", selectedCategory)
			if (stockInput) formData.append("stock", stockInput.value)

			// Process details
			const details: Record<string, string> = {}
			const detailsContainer = document.getElementById("details-container")
			if (detailsContainer) {
				const inputs = detailsContainer.getElementsByTagName("input")
				for (let i = 0; i < inputs.length; i += 2) {
					const keyInput = inputs[i] as HTMLInputElement
					const valueInput = inputs[i + 1] as HTMLInputElement
					const key = keyInput.value.trim()
					const value = valueInput.value.trim()
					if (key && value) {
						details[key] = value
					}
				}
			}

			// Process variants
			const variants: Record<string, string[]> = {}
			const variantsContainer = document.getElementById("variants-container")
			if (variantsContainer) {
				const inputs = variantsContainer.getElementsByTagName("input")
				for (let i = 0; i < inputs.length; i += 2) {
					const keyInput = inputs[i] as HTMLInputElement
					const valueInput = inputs[i + 1] as HTMLInputElement
					const key = keyInput.value.trim()
					const value = valueInput.value.trim()
					if (key && value) {
						variants[key] = value.split(",").map((v) => v.trim())
					}
				}
			}

			// Process attributes
			const attributes: Record<string, string> = {}
			const attributesContainer = document.getElementById(
				"attributes-container",
			)
			if (attributesContainer) {
				const inputs = attributesContainer.getElementsByTagName("input")
				for (let i = 0; i < inputs.length; i += 2) {
					const keyInput = inputs[i] as HTMLInputElement
					const valueInput = inputs[i + 1] as HTMLInputElement
					const key = keyInput.value.trim()
					const value = valueInput.value.trim()
					if (key && value) {
						attributes[key] = value
					}
				}
			}

			// Add JSON data
			if (Object.keys(details).length > 0) {
				formData.append("details", JSON.stringify(details))
			}
			if (Object.keys(variants).length > 0) {
				formData.append("variants", JSON.stringify(variants))
			}
			if (Object.keys(attributes).length > 0) {
				formData.append("attributes", JSON.stringify(attributes))
			}

			// Add images
			images.forEach((image) => {
				formData.append("images", image)
			})

			if (product) {
				await productAPI.update(product.id, formData)
				toast.success("Produk berhasil diperbarui")
			} else {
				await productAPI.create(formData)
				toast.success("Produk berhasil dibuat")
			}

			onSuccess()
		} catch (err) {
			toast.error("Gagal menyimpan produk")
			console.error(err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="name">Nama</Label>
				<Input id="name" name="name" defaultValue={product?.name} required />
			</div>
			<div>
				<Label htmlFor="description">Deskripsi</Label>
				<Textarea
					id="description"
					name="description"
					defaultValue={product?.description}
					required
				/>
			</div>
			<div>
				<Label htmlFor="price">Harga (IDR)</Label>
				<Input
					id="price"
					name="price"
					type="number"
					defaultValue={product?.price}
					required
					min="0"
					step="1000"
					className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
				/>
			</div>
			<div>
				<Label htmlFor="category_id">Kategori</Label>
				<Select
					value={selectedCategory}
					onValueChange={setSelectedCategory}
					required
					disabled={isLoadingCategories}
					name="category_id"
				>
					<SelectTrigger id="category_id">
						<SelectValue
							placeholder={
								isLoadingCategories ? "Memuat kategori..." : "Pilih kategori"
							}
						>
							{selectedCategoryData?.data?.name || "Pilih kategori"}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{isLoadingCategories ? (
							<SelectItem value="loading" disabled>
								Memuat kategori...
							</SelectItem>
						) : categories && categories.length > 0 ? (
							categories.map((category) => (
								<SelectItem key={category.id} value={category.id}>
									{category.name}
								</SelectItem>
							))
						) : (
							<SelectItem value="no-categories" disabled>
								Tidak ada kategori tersedia
							</SelectItem>
						)}
					</SelectContent>
				</Select>
			</div>
			<div>
				<Label htmlFor="stock">Stok</Label>
				<Input
					id="stock"
					name="stock"
					type="number"
					defaultValue={product?.stock}
					required
					min="0"
				/>
			</div>

			{/* Image Upload Section */}
			<div className="space-y-2">
				<Label>Gambar Produk</Label>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					{previewUrls.map((url, index) => (
						<div key={index} className="relative group">
							<img
								src={url}
								alt={`Product image ${index + 1}`}
								className="w-full h-32 object-cover rounded-lg"
							/>
							<Button
								type="button"
								variant="destructive"
								size="icon"
								className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
								onClick={() => removeImage(index)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}
					<label
						htmlFor="images"
						className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
					>
						<Upload className="h-8 w-8 text-gray-400" />
						<span className="text-sm text-gray-500 mt-2">Add Image</span>
						<input
							id="images"
							type="file"
							accept="image/*"
							multiple
							className="hidden"
							onChange={handleImageChange}
						/>
					</label>
				</div>
			</div>

			{/* Details Section */}
			<div className="space-y-2">
				<Label>Product Details</Label>
				<div id="details-container" className="space-y-2">
					{product?.details &&
						Object.entries(product.details).map(([key, value], index) => (
							<div key={index} className="flex gap-2">
								<Input
									name={`details_key_${index}`}
									placeholder="Key"
									defaultValue={key}
								/>
								<Input
									name={`details_value_${index}`}
									placeholder="Value"
									defaultValue={value as string}
								/>
								<Button
									type="button"
									variant="destructive"
									size="icon"
									onClick={() => {
										const container =
											document.getElementById("details-container")
										if (container) {
											const element = container.children[index]
											if (element) element.remove()
										}
									}}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						))}
				</div>
				<Button
					type="button"
					variant="outline"
					onClick={() => {
						const container = document.getElementById("details-container")
						if (container) {
							const index = container.children.length
							const div = document.createElement("div")
							div.className = "flex gap-2"
							div.innerHTML = `
								<input name="details_key_${index}" placeholder="Key" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
								<input name="details_value_${index}" placeholder="Value" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
								<button type="button" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10" onclick="this.parentElement.remove()">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
								</button>
							`
							container.appendChild(div)
						}
					}}
				>
					Add Detail
				</Button>
			</div>

			{/* Variants Section */}
			<div className="space-y-2">
				<Label>Product Variants</Label>
				<div id="variants-container" className="space-y-2">
					{product?.variants &&
						Object.entries(product.variants).map(([key, value], index) => (
							<div key={index} className="flex gap-2">
								<Input
									name={`variants_key_${index}`}
									placeholder="Variant Name"
									defaultValue={key}
								/>
								<Input
									name={`variants_value_${index}`}
									placeholder="Variant Options (comma separated)"
									defaultValue={Array.isArray(value) ? value.join(", ") : value}
								/>
								<Button
									type="button"
									variant="destructive"
									size="icon"
									onClick={() => {
										const container =
											document.getElementById("variants-container")
										if (container) {
											const element = container.children[index]
											if (element) element.remove()
										}
									}}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						))}
				</div>
				<Button
					type="button"
					variant="outline"
					onClick={() => {
						const container = document.getElementById("variants-container")
						if (container) {
							const index = container.children.length
							const div = document.createElement("div")
							div.className = "flex gap-2"
							div.innerHTML = `
								<input name="variants_key_${index}" placeholder="Variant Name" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
								<input name="variants_value_${index}" placeholder="Variant Options (comma separated)" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
								<button type="button" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10" onclick="this.parentElement.remove()">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
								</button>
							`
							container.appendChild(div)
						}
					}}
				>
					Add Variant
				</Button>
			</div>

			{/* Attributes Section */}
			<div className="space-y-2">
				<Label>Product Attributes</Label>
				<div id="attributes-container" className="space-y-2">
					{product?.attributes &&
						Object.entries(product.attributes).map(([key, value], index) => (
							<div key={index} className="flex gap-2">
								<Input
									name={`attributes_key_${index}`}
									placeholder="Attribute Name"
									defaultValue={key}
								/>
								<Input
									name={`attributes_value_${index}`}
									placeholder="Attribute Value"
									defaultValue={value as string}
								/>
								<Button
									type="button"
									variant="destructive"
									size="icon"
									onClick={() => {
										const container = document.getElementById(
											"attributes-container",
										)
										if (container) {
											const element = container.children[index]
											if (element) element.remove()
										}
									}}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						))}
				</div>
				<Button
					type="button"
					variant="outline"
					onClick={() => {
						const container = document.getElementById("attributes-container")
						if (container) {
							const index = container.children.length
							const div = document.createElement("div")
							div.className = "flex gap-2"
							div.innerHTML = `
								<input name="attributes_key_${index}" placeholder="Attribute Name" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
								<input name="attributes_value_${index}" placeholder="Attribute Value" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
								<button type="button" class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10" onclick="this.parentElement.remove()">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
								</button>
							`
							container.appendChild(div)
						}
					}}
				>
					Add Attribute
				</Button>
			</div>

			<div className="flex gap-2">
				<Button type="submit" className="flex-1" disabled={isLoading}>
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{product ? "Update Product" : "Add Product"}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					disabled={isLoading}
				>
					Cancel
				</Button>
			</div>
		</form>
	)
}
