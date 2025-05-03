// src/app/(auth)/login/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

// Define form schema
const loginSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	})

	const onSubmit = async (data: LoginFormValues) => {
		setIsLoading(true)

		try {
			const result = await signIn("credentials", {
				username: data.username,
				password: data.password,
				redirect: false,
			})

			if (result?.error) {
				toast.error("Login failed. Please check your credentials.")
			} else {
				toast.success("Login successful!")
				router.push("/")
				router.refresh()
			}
		} catch (error) {
			toast.error("An unexpected error occurred")
			console.error("Login error:", error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div>
			<div className="text-center mb-6">
				<h1 className="text-2xl font-bold">Sign In</h1>
				<p className="text-sm text-gray-600 mt-2">
					Enter your credentials to access your account
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
						placeholder="Enter your username"
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
						placeholder="Enter your password"
						disabled={isLoading}
					/>
					{errors.password && (
						<p className="text-red-500 text-xs mt-1">
							{errors.password.message}
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
							Signing in...
						</span>
					) : (
						"Sign In"
					)}
				</button>
			</form>

			<div className="mt-6 text-center text-sm">
				<p>
					Don&apos;t have an account?{" "}
					<Link href="/register" className="text-primary font-medium">
						Register here
					</Link>
				</p>
			</div>
		</div>
	)
}
