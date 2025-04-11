"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight, CreditCard, Lock } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CheckoutPaymentPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<any>(null)

  // Payment form state
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  })

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load shipping address from localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem("shippingAddress")
    if (savedAddress) {
      try {
        setShippingAddress(JSON.parse(savedAddress))
      } catch (error) {
        console.error("Failed to parse shipping address:", error)
      }
    }
  }, [])

  // Calculate order summary
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const shipping = subtotal > 0 ? 10 : 0
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shipping + tax

  // Handle payment input changes
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19)

      setPaymentDetails((prev) => ({
        ...prev,
        [name]: formattedValue,
      }))
    } else {
      setPaymentDetails((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Generate years for expiry date select
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString())

  // Generate months for expiry date select
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    return month < 10 ? `0${month}` : month.toString()
  })

  // Validate the form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate card number (16 digits, spaces allowed)
    if (!paymentDetails.cardNumber || paymentDetails.cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number"
    }

    // Validate card name
    if (!paymentDetails.cardName) {
      newErrors.cardName = "Please enter the name on your card"
    }

    // Validate expiry date
    if (!paymentDetails.expiryMonth) {
      newErrors.expiryMonth = "Required"
    }

    if (!paymentDetails.expiryYear) {
      newErrors.expiryYear = "Required"
    }

    // Validate CVV (3 or 4 digits)
    if (!paymentDetails.cvv || !/^\d{3,4}$/.test(paymentDetails.cvv)) {
      newErrors.cvv = "Please enter a valid 3 or 4 digit CVV"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    // In a real app, you would process the payment through a payment gateway
    // For this demo, we'll just simulate a delay and then redirect
    setTimeout(() => {
      clearCart()
      router.push("/checkout/success")
    }, 2000)
  }

  // Redirect if cart is empty
  if (cart.length === 0 && typeof window !== "undefined") {
    router.push("/cart")
    return null
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            1
          </div>
          <span className="ml-2 font-medium">Cart</span>
        </div>
        <div className="mx-4 h-px w-16 bg-primary"></div>
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            2
          </div>
          <span className="ml-2 font-medium">Address</span>
        </div>
        <div className="mx-4 h-px w-16 bg-primary"></div>
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            3
          </div>
          <span className="ml-2 font-medium">Payment</span>
        </div>
        <div className="mx-4 h-px w-16 bg-muted"></div>
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">4</div>
          <span className="ml-2 text-muted-foreground">Confirmation</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">Credit / Debit Card</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={errors.cardNumber ? "border-destructive" : ""}
                  />
                  {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    value={paymentDetails.cardName}
                    onChange={handlePaymentChange}
                    placeholder="John Doe"
                    className={errors.cardName ? "border-destructive" : ""}
                  />
                  {errors.cardName && <p className="text-sm text-destructive">{errors.cardName}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiryMonth">Expiry Month</Label>
                    <Select
                      value={paymentDetails.expiryMonth}
                      onValueChange={(value) => {
                        setPaymentDetails((prev) => ({ ...prev, expiryMonth: value }))
                        if (errors.expiryMonth) {
                          setErrors((prev) => {
                            const newErrors = { ...prev }
                            delete newErrors.expiryMonth
                            return newErrors
                          })
                        }
                      }}
                    >
                      <SelectTrigger className={errors.expiryMonth ? "border-destructive" : ""}>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.expiryMonth && <p className="text-sm text-destructive">{errors.expiryMonth}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryYear">Expiry Year</Label>
                    <Select
                      value={paymentDetails.expiryYear}
                      onValueChange={(value) => {
                        setPaymentDetails((prev) => ({ ...prev, expiryYear: value }))
                        if (errors.expiryYear) {
                          setErrors((prev) => {
                            const newErrors = { ...prev }
                            delete newErrors.expiryYear
                            return newErrors
                          })
                        }
                      }}
                    >
                      <SelectTrigger className={errors.expiryYear ? "border-destructive" : ""}>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.expiryYear && <p className="text-sm text-destructive">{errors.expiryYear}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={handlePaymentChange}
                      placeholder="123"
                      maxLength={4}
                      className={errors.cvv ? "border-destructive" : ""}
                    />
                    {errors.cvv && <p className="text-sm text-destructive">{errors.cvv}</p>}
                  </div>
                </div>

                <div className="flex items-center mt-4 text-sm text-muted-foreground">
                  <Lock className="mr-2 h-4 w-4" />
                  Your payment information is secure and encrypted
                </div>
              </CardContent>
            </Card>

            {shippingAddress && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p className="font-medium">{shippingAddress.fullName}</p>
                    <p>{shippingAddress.streetAddress}</p>
                    {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
                    <p>
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                    </p>
                    <p>{shippingAddress.country}</p>
                    <p className="mt-2">Phone: {shippingAddress.phone}</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/checkout/address">Edit Address</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button type="button" variant="outline" asChild>
                <Link href="/checkout/address">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Address
                </Link>
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? "Processing Payment..." : "Complete Order"}
                {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium">{item.quantity} ×</span>
                    <span className="text-sm">{item.product.name}</span>
                  </div>
                  <span className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
