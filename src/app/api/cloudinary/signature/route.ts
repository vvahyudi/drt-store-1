import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

export async function GET() {
	try {
		const timestamp = Math.round(new Date().getTime() / 1000)

		// This should be set up in your environment variables
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
		})

		const signature = cloudinary.utils.api_sign_request(
			{
				timestamp,
				folder: "products",
			},
			process.env.CLOUDINARY_API_SECRET || "",
		)

		return NextResponse.json({
			signature,
			timestamp,
			cloudName: process.env.CLOUDINARY_CLOUD_NAME,
			apiKey: process.env.CLOUDINARY_API_KEY,
		})
	} catch (error) {
		console.error("Error generating signature:", error)
		return NextResponse.json(
			{ error: "Failed to generate upload signature" },
			{ status: 500 },
		)
	}
}
