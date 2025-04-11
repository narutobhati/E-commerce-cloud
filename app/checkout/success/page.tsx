"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function CheckoutSuccessPage() {
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: "",
    shippingAddress: null as any,
    orderDate: "",
  })

  useEffect(() => {
    // Generate a random order number
    const orderNumber = `ORD-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`

    // Get shipping address from localStorage
    let shippingAddress = null
    try {
      const savedAddress = localStorage.getItem("shippingAddress")
      if (savedAddress) {
        shippingAddress = JSON.parse(savedAddress)
      }
    } catch (error) {
      console.error("Failed to parse shipping address:", error)
    }

    // Get current date
    const orderDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    setOrderDetails({
      orderNumber,
      shippingAddress,
      orderDate,
    })

    // Clear localStorage data
    localStorage.removeItem("shippingAddress")
    localStorage.removeItem("billingAddress")
  }, [])

  return (
    <div className="container flex flex-col items-center justify-center py-16 text-center">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <h1 className="mt-6 text-3xl font-bold">Order Successful!</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Thank you for your purchase. Your order has been received and is being processed. You will receive an email
        confirmation shortly.
      </p>

      {orderDetails.orderNumber && (
        <Card className="mt-8 w-full max-w-md text-left">
          <CardContent className="pt-6">
            <h2 className="mb-4 text-xl font-semibold">Order Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number:</span>
                <span className="font-medium">{orderDetails.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{orderDetails.orderDate}</span>
              </div>

              {orderDetails.shippingAddress && (
                <>
                  <Separator className="my-4" />
                  <h3 className="font-medium">Shipping Address</h3>
                  <div className="text-sm">
                    <p>{orderDetails.shippingAddress.fullName}</p>
                    <p>{orderDetails.shippingAddress.streetAddress}</p>
                    {orderDetails.shippingAddress.apartment && <p>{orderDetails.shippingAddress.apartment}</p>}
                    <p>
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}{" "}
                      {orderDetails.shippingAddress.zipCode}
                    </p>
                    <p>{orderDetails.shippingAddress.country}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 flex space-x-4">
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/orders">View Orders</Link>
        </Button>
      </div>
    </div>
  )
}
