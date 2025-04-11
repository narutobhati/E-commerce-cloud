"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

// List of countries for the dropdown
const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "India",
  "Brazil",
]

export default function CheckoutAddressPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [sameAsBilling, setSameAsBilling] = useState(true)

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
  })

  // Billing address state (only used if sameAsBilling is false)
  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
  })

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Calculate order summary
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const shipping = subtotal > 0 ? 10 : 0
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shipping + tax

  // Handle shipping address input changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle billing address input changes
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBillingAddress((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field if it exists
    if (errors[`billing_${name}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`billing_${name}`]
        return newErrors
      })
    }
  }

  // Validate the form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required shipping fields
    const requiredShippingFields = ["fullName", "streetAddress", "city", "state", "zipCode", "phone"]
    requiredShippingFields.forEach((field) => {
      if (!shippingAddress[field as keyof typeof shippingAddress]) {
        newErrors[field] = "This field is required"
      }
    })

    // Validate phone number format
    if (shippingAddress.phone && !/^\d{10}$/.test(shippingAddress.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }

    // Validate zip code format
    if (shippingAddress.zipCode && !/^\d{5}(-\d{4})?$/.test(shippingAddress.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)"
    }

    // If billing address is different, validate those fields too
    if (!sameAsBilling) {
      requiredShippingFields.forEach((field) => {
        if (!billingAddress[field as keyof typeof billingAddress]) {
          newErrors[`billing_${field}`] = "This field is required"
        }
      })

      // Validate billing phone number format
      if (billingAddress.phone && !/^\d{10}$/.test(billingAddress.phone.replace(/\D/g, ""))) {
        newErrors.billing_phone = "Please enter a valid 10-digit phone number"
      }

      // Validate billing zip code format
      if (billingAddress.zipCode && !/^\d{5}(-\d{4})?$/.test(billingAddress.zipCode)) {
        newErrors.billing_zipCode = "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)"
      }
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

    // In a real app, you would send the address data to your backend
    // For this demo, we'll just simulate a delay and then redirect
    setTimeout(() => {
      // Store address in localStorage or state management for order confirmation
      localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress))
      localStorage.setItem("billingAddress", JSON.stringify(sameAsBilling ? shippingAddress : billingAddress))

      // Proceed to payment page or directly to success
      router.push("/checkout/payment")
    }, 1500)
  }

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2">You need to add items to your cart before checking out.</p>
        <Button asChild className="mt-4">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    )
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
        <div className="mx-4 h-px w-16 bg-muted"></div>
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">3</div>
          <span className="ml-2 text-muted-foreground">Payment</span>
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
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleShippingChange}
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleShippingChange}
                      placeholder="(123) 456-7890"
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input
                    id="streetAddress"
                    name="streetAddress"
                    value={shippingAddress.streetAddress}
                    onChange={handleShippingChange}
                    className={errors.streetAddress ? "border-destructive" : ""}
                  />
                  {errors.streetAddress && <p className="text-sm text-destructive">{errors.streetAddress}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                  <Input
                    id="apartment"
                    name="apartment"
                    value={shippingAddress.apartment}
                    onChange={handleShippingChange}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleShippingChange}
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                      id="state"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleShippingChange}
                      className={errors.state ? "border-destructive" : ""}
                    />
                    {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleShippingChange}
                      className={errors.zipCode ? "border-destructive" : ""}
                    />
                    {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={shippingAddress.country}
                    onValueChange={(value) => setShippingAddress((prev) => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Billing Address</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAsBilling"
                      checked={sameAsBilling}
                      onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
                    />
                    <Label htmlFor="sameAsBilling">Same as shipping address</Label>
                  </div>
                </div>
              </CardHeader>

              {!sameAsBilling && (
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="billing_fullName">Full Name</Label>
                      <Input
                        id="billing_fullName"
                        name="fullName"
                        value={billingAddress.fullName}
                        onChange={handleBillingChange}
                        className={errors.billing_fullName ? "border-destructive" : ""}
                      />
                      {errors.billing_fullName && <p className="text-sm text-destructive">{errors.billing_fullName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing_phone">Phone Number</Label>
                      <Input
                        id="billing_phone"
                        name="phone"
                        value={billingAddress.phone}
                        onChange={handleBillingChange}
                        placeholder="(123) 456-7890"
                        className={errors.billing_phone ? "border-destructive" : ""}
                      />
                      {errors.billing_phone && <p className="text-sm text-destructive">{errors.billing_phone}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billing_streetAddress">Street Address</Label>
                    <Input
                      id="billing_streetAddress"
                      name="streetAddress"
                      value={billingAddress.streetAddress}
                      onChange={handleBillingChange}
                      className={errors.billing_streetAddress ? "border-destructive" : ""}
                    />
                    {errors.billing_streetAddress && (
                      <p className="text-sm text-destructive">{errors.billing_streetAddress}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billing_apartment">Apartment, suite, etc. (optional)</Label>
                    <Input
                      id="billing_apartment"
                      name="apartment"
                      value={billingAddress.apartment}
                      onChange={handleBillingChange}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="billing_city">City</Label>
                      <Input
                        id="billing_city"
                        name="city"
                        value={billingAddress.city}
                        onChange={handleBillingChange}
                        className={errors.billing_city ? "border-destructive" : ""}
                      />
                      {errors.billing_city && <p className="text-sm text-destructive">{errors.billing_city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing_state">State / Province</Label>
                      <Input
                        id="billing_state"
                        name="state"
                        value={billingAddress.state}
                        onChange={handleBillingChange}
                        className={errors.billing_state ? "border-destructive" : ""}
                      />
                      {errors.billing_state && <p className="text-sm text-destructive">{errors.billing_state}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing_zipCode">ZIP / Postal Code</Label>
                      <Input
                        id="billing_zipCode"
                        name="zipCode"
                        value={billingAddress.zipCode}
                        onChange={handleBillingChange}
                        className={errors.billing_zipCode ? "border-destructive" : ""}
                      />
                      {errors.billing_zipCode && <p className="text-sm text-destructive">{errors.billing_zipCode}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billing_country">Country</Label>
                    <Select
                      value={billingAddress.country}
                      onValueChange={(value) => setBillingAddress((prev) => ({ ...prev, country: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              )}
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" asChild>
                <Link href="/cart">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Cart
                </Link>
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Continue to Payment"}
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
