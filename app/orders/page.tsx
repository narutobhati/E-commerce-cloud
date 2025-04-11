"use client"

import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Package } from "lucide-react"

// Mock order data
const orders = [
  {
    id: "ORD-1234",
    date: "2023-04-15",
    status: "Delivered",
    total: 349.97,
    items: [
      { name: "Premium Wireless Headphones", quantity: 1, price: 249.99 },
      { name: "Portable Bluetooth Speaker", quantity: 1, price: 99.98 },
    ],
  },
  {
    id: "ORD-5678",
    date: "2023-03-28",
    status: "Processing",
    total: 199.99,
    items: [{ name: "Smart Fitness Watch", quantity: 1, price: 199.99 }],
  },
]

export default function OrdersPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">You need to be logged in to view your orders</h1>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No orders yet</h2>
          <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          <Button asChild>
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <CardDescription>Placed on {new Date(order.date).toLocaleDateString()}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className={order.status === "Delivered" ? "text-green-500" : "text-amber-500"}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between border-t pt-4">
                    <p className="font-bold">Total</p>
                    <p className="font-bold">${order.total.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/orders/${order.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
