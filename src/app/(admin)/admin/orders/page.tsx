"use client"

import { useState, useCallback } from "react"
import type { Order } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from "@/components/layout/header"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Search, Eye } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { toast } from "sonner"
import { format } from "date-fns"

// Mock data for orders
const MOCK_ORDERS: Order[] = [
	{
		id: "ORD001",
		customer_name: "John Doe",
		customer_email: "john@example.com",
		total: 1500000,
		status: "pending",
		created_at: "2024-03-15T10:00:00Z",
		updated_at: "2024-03-15T10:00:00Z",
	},
	{
		id: "ORD002",
		customer_name: "Jane Smith",
		customer_email: "jane@example.com",
		total: 2750000,
		status: "processing",
		created_at: "2024-03-14T15:30:00Z",
		updated_at: "2024-03-14T15:30:00Z",
	},
	{
		id: "ORD003",
		customer_name: "Bob Johnson",
		customer_email: "bob@example.com",
		total: 950000,
		status: "shipped",
		created_at: "2024-03-13T09:15:00Z",
		updated_at: "2024-03-13T09:15:00Z",
	},
	{
		id: "ORD004",
		customer_name: "Alice Brown",
		customer_email: "alice@example.com",
		total: 3200000,
		status: "delivered",
		created_at: "2024-03-12T14:45:00Z",
		updated_at: "2024-03-12T14:45:00Z",
	},
	{
		id: "ORD005",
		customer_name: "Charlie Wilson",
		customer_email: "charlie@example.com",
		total: 1800000,
		status: "cancelled",
		created_at: "2024-03-11T11:20:00Z",
		updated_at: "2024-03-11T11:20:00Z",
	},
]

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
	const [searchQuery, setSearchQuery] = useState("")
	const [statusFilter, setStatusFilter] = useState<string>("all")

	const debouncedSearchQuery = useDebounce(searchQuery, 300)

	const filteredOrders = useCallback(() => {
		return orders.filter((order) => {
			const matchesSearch =
				order.customer_name
					.toLowerCase()
					.includes(debouncedSearchQuery.toLowerCase()) ||
				order.customer_email
					.toLowerCase()
					.includes(debouncedSearchQuery.toLowerCase()) ||
				order.id.toLowerCase().includes(debouncedSearchQuery.toLowerCase())

			const matchesStatus =
				statusFilter === "all" || order.status === statusFilter

			return matchesSearch && matchesStatus
		})
	}, [orders, debouncedSearchQuery, statusFilter])

	const handleStatusChange = (orderId: string, newStatus: string) => {
		setOrders((prevOrders) =>
			prevOrders.map((order) =>
				order.id === orderId
					? {
							...order,
							status: newStatus as Order["status"],
							updated_at: new Date().toISOString(),
					  }
					: order,
			),
		)
		toast.success("Order status updated successfully")
	}

	return (
		<>
			<Header />
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>

				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
						<div className="relative w-full sm:w-72">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
							<Input
								type="text"
								placeholder="Search orders..."
								className="pl-10"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Orders</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="processing">Processing</SelectItem>
								<SelectItem value="shipped">Shipped</SelectItem>
								<SelectItem value="delivered">Delivered</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="rounded-lg border overflow-hidden">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order ID</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Total</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredOrders().length > 0 ? (
								filteredOrders().map((order) => (
									<TableRow key={order.id}>
										<TableCell className="font-medium">#{order.id}</TableCell>
										<TableCell>
											{format(new Date(order.created_at), "MMM d, yyyy")}
										</TableCell>
										<TableCell>
											{order.customer_name}
											<br />
											<span className="text-sm text-gray-500">
												{order.customer_email}
											</span>
										</TableCell>
										<TableCell>{formatCurrency(order.total)}</TableCell>
										<TableCell>
											<Select
												value={order.status}
												onValueChange={(value) =>
													handleStatusChange(order.id, value)
												}
											>
												<SelectTrigger className="w-[130px]">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="pending">Pending</SelectItem>
													<SelectItem value="processing">Processing</SelectItem>
													<SelectItem value="shipped">Shipped</SelectItem>
													<SelectItem value="delivered">Delivered</SelectItem>
													<SelectItem value="cancelled">Cancelled</SelectItem>
												</SelectContent>
											</Select>
										</TableCell>
										<TableCell className="text-right">
											<Button
												variant="ghost"
												size="icon"
												aria-label="View order details"
											>
												<Eye className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={6} className="text-center py-8">
										No orders found
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</>
	)
}
