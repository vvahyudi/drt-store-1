"use client"

import { useState } from "react"
import type { Category } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { categoryAPI } from "@/lib/api"
import { toast } from "sonner"
import { Loader2, Upload, Trash2 } from "lucide-react"
import Image from "next/image"

interface CategoryFormProps {
	category: Category | null
	onSuccess: () => void
	onCancel: () => void
}

export default function CategoryForm({
	category,
	onSuccess,
	onCancel,
}: CategoryFormProps) {
	const [formData, setFormData] = useState({
		name: category?.name || "",
		description: category?.description || "",
	})
	const [image, setImage] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		category?.image_url || null,
	)
	const [isLoading, setIsLoading] = useState(false)

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setImage(file)
			setPreviewUrl(URL.createObjectURL(file))
		}
	}

	const removeImage = () => {
		setImage(null)
		setPreviewUrl(null)
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const form = new FormData()
			form.append("name", formData.name)
			form.append("description", formData.description)
			if (image) {
				form.append("image", image)
			}

			if (category) {
				await categoryAPI.update(category.id, form)
				toast.success("Kategori berhasil diperbarui")
			} else {
				await categoryAPI.create(form)
				toast.success("Kategori berhasil dibuat")
			}
			onSuccess()
		} catch (error) {
			toast.error("Gagal menyimpan kategori")
			console.error("Error saving category:", error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-4">
				<div>
					<Label htmlFor="name">Nama</Label>
					<Input
						id="name"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						required
					/>
				</div>

				<div>
					<Label htmlFor="description">Deskripsi</Label>
					<Textarea
						id="description"
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
					/>
				</div>

				{/* Image Upload Section */}
				<div className="space-y-2">
					<Label>Gambar Kategori</Label>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{previewUrl && (
							<div className="relative group">
								<div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
									<Image
										src={previewUrl}
										alt="Category image"
										fill
										className="object-cover"
									/>
								</div>
								<Button
									type="button"
									variant="destructive"
									size="icon"
									className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
									onClick={removeImage}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						)}
						<label
							htmlFor="image"
							className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
						>
							<Upload className="h-8 w-8 text-gray-400" />
							<span className="text-sm text-gray-500 mt-2">Tambah Gambar</span>
							<input
								id="image"
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleImageChange}
							/>
						</label>
					</div>
				</div>
			</div>

			<div className="flex justify-end gap-3 pt-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Batal
				</Button>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
					{category ? "Perbarui Kategori" : "Tambah Kategori"}
				</Button>
			</div>
		</form>
	)
}
