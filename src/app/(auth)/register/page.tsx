// src/app/(auth)/register/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { authAPI } from "@/lib/api"

// Define form schema
const registerSchema = z
	.object({
		fullname: z.string().min(1, "Full name is required"),
		username: z.string().min(3, "Username must be at least 3 characters"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			fullname: "",
			username: "",
			password: "",
			confirmPassword: "",
		},
	})

	const onSubmit = async (data: RegisterFormValues) => {
		setIsLoading(true)

		try {
			// Destructuring to remove confirmPassword
			const { confirmPassword, ...registerData } = data

			const response = await authAPI.register(registerData)

			if (response.status === 200) {
				toast.success("Registration successful! You can now log in.")
				router.push("/login")
			} else {
				toast.error("Registration failed")
			}
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.message || "An unexpected error occurred"
			toast.error(errorMessage)
			console.error("Registration error:", error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div>
			<div className="text-center mb-6">
				<h1 className="text-2xl font-bold">Create an Account</h1>
				<p className="text-sm text-gray-600 mt-2">
					Fill in the details below to create your account
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<label
						htmlFor="fullname"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Full Name
					</label>
					<input
						id="fullname"
						{...register("fullname")}
						className="w-full p-2 border rounded-md"
						placeholder="Enter your full name"
						disabled={isLoading}
					/>
					{errors.fullname && (
						<p className="text-red-500 text-xs mt-1">
							{errors.fullname.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="username"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Username
					</label>
					<input
						id="username"
						{...register("username")}
						className="w-full p-2 border rounded-md"
						placeholder="Choose a username"
						disabled={isLoading}
					/>
					{errors.username && (
						<p className="text-red-500 text-xs mt-1">
							{errors.username.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Password
					</label>
					<input
						id="password"
						{...register("password")}
						type="password"
						className="w-full p-2 border rounded-md"
						placeholder="Create a password"
						disabled={isLoading}
					/>
					{errors.password && (
						<p className="text-red-500 text-xs mt-1">
							{errors.password.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="confirmPassword"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						{...register("confirmPassword")}
						type="password"
						className="w-full p-2 border rounded-md"
						placeholder="Confirm your password"
						disabled={isLoading}
					/>
					{errors.confirmPassword && (
						<p className="text-red-500 text-xs mt-1">
							{errors.confirmPassword.message}
						</p>
					)}
				</div>

				<button
					type="submit"
					className="w-full py-2 px-4 bg-primary text-white rounded-md font-medium disabled:opacity-70"
					disabled={isLoading}
				>
					{isLoading ? (
						<span className="flex items-center justify-center">
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Creating account...
						</span>
					) : (
						"Register"
					)}
				</button>
			</form>

			<div className="mt-6 text-center text-sm">
				<p>
					Already have an account?{" "}
					<Link href="/login" className="text-primary font-medium">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	)
}
