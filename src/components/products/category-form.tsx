"use client"

import { useState } from "react"
import type { Category } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { categoryAPI } from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

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
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			if (category) {
				await categoryAPI.update(category.id, formData)
				toast.success("Kategori berhasil diperbarui")
			} else {
				await categoryAPI.create(formData)
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
