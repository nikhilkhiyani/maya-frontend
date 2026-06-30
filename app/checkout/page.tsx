'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/lib/hooks/useCart'
import { useAuth } from '@/lib/hooks'
import { checkoutApi, addressesApi, BackendAddress, PaymentMethod } from '@/lib/api'
import { formatPrice } from '@/lib/utils'

const STEPS = ['Address', 'Details', 'Payment']

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, isLoading: cartLoading, hasLoaded: cartLoaded } = useCart()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const orderSubmitted = useRef(false)

  const [step, setStep] = useState(0)
  const [addresses, setAddresses] = useState<BackendAddress[]>([])
  const [addressesLoaded, setAddressesLoaded] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI_QR')
  const [couponCode, setCouponCode] = useState('')
  const [orderNotes, setOrderNotes] = useState('')
  const [gstNumber, setGstNumber] = useState('')
  const [email, setEmail] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '',
  })

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      router.replace('/login?redirect=/checkout')
      return
    }

    addressesApi.getAll().then((data) => {
      setAddresses(data)
      const defaultAddr = data.find((a) => a.isDefault) || data[0]
      if (defaultAddr) setSelectedAddress(defaultAddr.id)
      if (data.length === 0) setShowAddressForm(true)
    }).catch(() => setShowAddressForm(true))
      .finally(() => setAddressesLoaded(true))
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (authLoading || !cartLoaded || orderSubmitted.current || placing) return
    if (!isAuthenticated) return
    if (cartItems.length === 0) {
      router.replace('/cart')
    }
  }, [authLoading, cartLoaded, cartItems.length, isAuthenticated, placing, router])

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 999 ? 0 : 99
  const tax = subtotal * 0.18
  const discount = couponCode.toUpperCase() === 'MAYA10' ? subtotal * 0.1 : 0
  const total = subtotal + shipping + tax - discount

  const handleAddAddress = async () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine1 ||
        !newAddress.city || !newAddress.state || !newAddress.pincode) {
      setError('Please fill all required address fields')
      return
    }
    try {
      const created = await addressesApi.create({ ...newAddress, isDefault: addresses.length === 0 })
      setAddresses((prev) => [...prev, created])
      setSelectedAddress(created.id)
      setShowAddressForm(false)
      setError('')
    } catch {
      setError('Failed to save address')
    }
  }

  const handleProceedToPayment = async () => {
    if (!selectedAddress) {
      setError('Please select a shipping address')
      setStep(0)
      return
    }
    if (!termsAccepted) {
      setError('Please accept the terms and conditions')
      return
    }

    setPlacing(true)
    setError('')

    try {
      const session = await checkoutApi.createSession({
        addressId: selectedAddress,
        billingSameAsShipping,
        email: email || undefined,
        gstNumber: gstNumber || undefined,
        couponCode: couponCode || undefined,
        orderNotes: orderNotes || undefined,
        termsAccepted: true,
        paymentMethod,
        fromCart: true,
      })

      orderSubmitted.current = true

      if (paymentMethod === 'COD' && session.orderId) {
        router.replace(`/orders/${session.orderId}`)
        return
      }

      router.replace(`/checkout/payment?session=${session.id}`)
    } catch (err: unknown) {
      orderSubmitted.current = false
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to start checkout'
      setError(message || 'Failed to start checkout')
    } finally {
      setPlacing(false)
    }
  }

  const handleContinue = () => {
    setError('')
    if (step === 0) {
      if (!selectedAddress) {
        setError('Please select or save a shipping address')
        return
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const isPageLoading = authLoading || cartLoading || !cartLoaded || !addressesLoaded

  if (isPageLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900" />
      </div>
    )
  }

  if (!isAuthenticated || cartItems.length === 0) {
    return null
  }

  const isFinalStep = step === STEPS.length - 1

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-6">Checkout</h1>

        <div className="flex gap-2 mb-10 overflow-x-auto">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= step ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'
              }`}>{i + 1}</div>
              <span className={`text-sm whitespace-nowrap ${i <= step ? 'text-neutral-900' : 'text-neutral-400'}`}>{label}</span>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-neutral-300 mx-1" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">{error}</div>
        )}

        <div className="grid lg:grid-cols-[1.6fr_0.8fr] gap-10">
          <div className="space-y-8">
            {step === 0 && (
              <Card className="border-0 shadow-xl bg-white rounded-3xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-serif mb-6">Shipping Address</h2>
                  {!showAddressForm && addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <label key={address.id} className={`block cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                          selectedAddress === address.id ? 'border-amber-600 bg-amber-50' : 'border-neutral-200 hover:border-neutral-400'
                        }`}>
                          <div className="flex gap-4">
                            <input type="radio" checked={selectedAddress === address.id}
                              onChange={() => setSelectedAddress(address.id)} />
                            <div>
                              <h3 className="font-semibold">{address.fullName}</h3>
                              <p className="text-neutral-500">{address.phone}</p>
                              <p className="text-neutral-600 mt-2">
                                {address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`},
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                            </div>
                          </div>
                        </label>
                      ))}
                      <Button type="button" variant="outline" onClick={() => setShowAddressForm(true)}>Add New Address</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input placeholder="Full Name" value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
                        <Input placeholder="Phone" value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                      </div>
                      <Input placeholder="Address Line 1" value={newAddress.addressLine1}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />
                      <Input placeholder="Address Line 2 (Optional)" value={newAddress.addressLine2}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })} />
                      <div className="grid md:grid-cols-3 gap-4">
                        <Input placeholder="City" value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                        <Input placeholder="State" value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                        <Input placeholder="Pincode" value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                      </div>
                      <Button type="button" onClick={handleAddAddress} className="w-full h-12 bg-neutral-900">Save Address</Button>
                      {addresses.length > 0 && (
                        <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)} className="w-full">
                          Use Saved Address
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {step === 1 && (
              <Card className="border-0 shadow-xl bg-white rounded-3xl">
                <CardContent className="p-8 space-y-4">
                  <h2 className="text-2xl font-serif mb-2">Contact & Billing</h2>
                  <Input placeholder="Email for order updates" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                  <Input placeholder="GST Number (optional)" value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)} />
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={billingSameAsShipping}
                      onChange={(e) => setBillingSameAsShipping(e.target.checked)} />
                    <span>Billing address same as shipping</span>
                  </label>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <>
                <Card className="border-0 shadow-xl bg-white rounded-3xl">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-serif mb-6">Payment Method</h2>
                    <div className="space-y-4">
                      {[
                        { id: 'UPI_QR' as const, title: 'UPI QR Payment', desc: 'Scan QR & pay via any UPI app' },
                        { id: 'COD' as const, title: 'Cash On Delivery', desc: 'Pay when you receive' },
                      ].map((method) => (
                        <label key={method.id} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer ${
                          paymentMethod === method.id ? 'border-amber-600 bg-amber-50' : 'border-neutral-200'
                        }`}>
                          <input type="radio" checked={paymentMethod === method.id}
                            onChange={() => setPaymentMethod(method.id)} />
                          <div>
                            <span className="font-medium block">{method.title}</span>
                            <span className="text-sm text-neutral-500">{method.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-white rounded-3xl">
                  <CardContent className="p-8 space-y-4">
                    <h2 className="text-2xl font-serif">Coupon & Notes</h2>
                    <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                    <Input placeholder="Order notes (optional)" value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} />
                    <label className="flex items-start gap-3 cursor-pointer text-sm">
                      <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1" />
                      <span>
                        I agree to the <Link href="/terms" className="text-amber-700 underline">Terms & Conditions</Link>,
                        {' '}<Link href="/refund" className="text-amber-700 underline">Refund Policy</Link>, and{' '}
                        <Link href="/shipping" className="text-amber-700 underline">Exchange Policy</Link>.
                      </span>
                    </label>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div>
            <Card className="sticky top-24 rounded-3xl border-0 shadow-2xl bg-white overflow-hidden">
              <div className="bg-neutral-900 text-white p-7">
                <h2 className="text-2xl font-serif">Order Summary</h2>
                <p className="text-neutral-400 text-sm mt-1">Est. delivery: 3–5 business days</p>
              </div>
              <CardContent className="p-8">
                <div className="space-y-3 text-sm mb-6">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <span className="text-neutral-600">{item.product.name} × {item.quantity}</span>
                      <span>{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                    <div className="flex justify-between"><span>Shipping</span>
                      <span className="text-green-600">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                    <div className="flex justify-between"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span><span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold pt-2">
                      <span>Total</span><span className="text-amber-700">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {!isFinalStep ? (
                  <Button type="button" onClick={handleContinue}
                    disabled={step === 0 && !selectedAddress}
                    className="w-full h-14 bg-neutral-900">
                    Continue
                  </Button>
                ) : (
                  <Button type="button" onClick={handleProceedToPayment}
                    disabled={!selectedAddress || placing || !termsAccepted}
                    className="w-full h-14 bg-neutral-900">
                    {placing ? 'Processing...' : paymentMethod === 'COD' ? 'Place Order' : 'Proceed to Payment'}
                  </Button>
                )}

                {step > 0 && (
                  <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)} className="w-full mt-3 h-11">
                    Back
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
