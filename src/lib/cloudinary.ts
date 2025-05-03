import { Cloudinary } from "@cloudinary/url-gen"

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export const createCloudinary = () => {
	if (!cloudName) {
		throw new Error("Cloudinary configuration is missing")
	}

	return new Cloudinary({
		cloud: {
			cloudName,
		},
	})
}

export const getUploadSignature = async () => {
	try {
		const response = await fetch("/api/cloudinary/signature", {
			method: "GET",
		})
		return response.json()
	} catch (error) {
		console.error("Error getting upload signature:", error)
		throw error
	}
}

export const uploadImage = async (file: File) => {
	if (!cloudName || !uploadPreset) {
		throw new Error("Cloudinary configuration is missing")
	}

	const formData = new FormData()
	formData.append("file", file)
	formData.append("upload_preset", uploadPreset)

	try {
		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
			{
				method: "POST",
				body: formData,
			},
		)

		if (!response.ok) {
			throw new Error("Failed to upload image")
		}

		const data = await response.json()
		return {
			url: data.secure_url,
			publicId: data.public_id,
			width: data.width,
			height: data.height,
			format: data.format,
		}
	} catch (error) {
		console.error("Error uploading image:", error)
		throw error
	}
}
