"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/layout/header"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
	const [isLoading, setIsLoading] = useState(false)
	const [settings, setSettings] = useState({
		storeName: "My Store",
		storeDescription: "Welcome to my store",
		storeEmail: "store@example.com",
		storePhone: "+1234567890",
		storeAddress: "123 Store Street, City, Country",
		currency: "IDR",
		enableNotifications: true,
		enableReviews: true,
		enableGuestCheckout: false,
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// TODO: Implement settings update API
			await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulated API call
			toast.success("Settings updated successfully")
		} catch (error) {
			toast.error("Failed to update settings")
		} finally {
			setIsLoading(false)
		}
	}

	const handleInputChange = (field: keyof typeof settings, value: any) => {
		setSettings((prev) => ({ ...prev, [field]: value }))
	}

	return (
		<>
			<Header />
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
					<Button
						onClick={handleSubmit}
						disabled={isLoading}
						className="min-w-[150px]"
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							"Save Changes"
						)}
					</Button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Store Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="storeName">Store Name *</Label>
									<Input
										id="storeName"
										value={settings.storeName}
										onChange={(e) =>
											handleInputChange("storeName", e.target.value)
										}
										required
									/>
								</div>

								<div>
									<Label htmlFor="currency">Currency *</Label>
									<Input
										id="currency"
										value={settings.currency}
										onChange={(e) =>
											handleInputChange("currency", e.target.value)
										}
										required
									/>
								</div>
							</div>

							<div>
								<Label htmlFor="storeDescription">Store Description</Label>
								<Textarea
									id="storeDescription"
									value={settings.storeDescription}
									onChange={(e) =>
										handleInputChange("storeDescription", e.target.value)
									}
									placeholder="Tell customers about your store"
									rows={3}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Contact Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="storeEmail">Email *</Label>
									<Input
										id="storeEmail"
										type="email"
										value={settings.storeEmail}
										onChange={(e) =>
											handleInputChange("storeEmail", e.target.value)
										}
										required
									/>
								</div>

								<div>
									<Label htmlFor="storePhone">Phone Number</Label>
									<Input
										id="storePhone"
										value={settings.storePhone}
										onChange={(e) =>
											handleInputChange("storePhone", e.target.value)
										}
										placeholder="+1234567890"
									/>
								</div>
							</div>

							<div>
								<Label htmlFor="storeAddress">Store Address</Label>
								<Textarea
									id="storeAddress"
									value={settings.storeAddress}
									onChange={(e) =>
										handleInputChange("storeAddress", e.target.value)
									}
									rows={2}
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Store Preferences</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
									<div>
										<Label htmlFor="enableNotifications">
											Email Notifications
										</Label>
										<p className="text-sm text-gray-500">
											Receive email notifications for new orders
										</p>
									</div>
									<Switch
										id="enableNotifications"
										checked={settings.enableNotifications}
										onCheckedChange={(checked) =>
											handleInputChange("enableNotifications", checked)
										}
									/>
								</div>

								<Separator />

								<div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
									<div>
										<Label htmlFor="enableReviews">Product Reviews</Label>
										<p className="text-sm text-gray-500">
											Allow customers to leave product reviews
										</p>
									</div>
									<Switch
										id="enableReviews"
										checked={settings.enableReviews}
										onCheckedChange={(checked) =>
											handleInputChange("enableReviews", checked)
										}
									/>
								</div>

								<Separator />

								<div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
									<div>
										<Label htmlFor="enableGuestCheckout">Guest Checkout</Label>
										<p className="text-sm text-gray-500">
											Allow customers to checkout without creating an account
										</p>
									</div>
									<Switch
										id="enableGuestCheckout"
										checked={settings.enableGuestCheckout}
										onCheckedChange={(checked) =>
											handleInputChange("enableGuestCheckout", checked)
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</form>
			</div>
		</>
	)
}
