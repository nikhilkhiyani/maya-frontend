'use client'

import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">Contact Us</h1>
          <p className="text-neutral-500 max-w-lg mx-auto">
            We&apos;d love to hear from you. Reach out for orders, styling advice, or partnership inquiries.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Email</h3>
                <p className="text-neutral-500">hello@maya.com</p>
                <p className="text-neutral-500">support@maya.com</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Phone</h3>
                <p className="text-neutral-500">+91 98765 43210</p>
                <p className="text-sm text-neutral-400">Mon–Sat, 10am–7pm IST</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Studio</h3>
                <p className="text-neutral-500">
                  42 Fashion District, Bandra West<br />
                  Mumbai, Maharashtra 400050
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-neutral-100">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-green-600">✓</span>
                </div>
                <h2 className="text-2xl font-serif mb-2">Message Sent</h2>
                <p className="text-neutral-500">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-12"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="h-12"
                    required
                  />
                </div>
                <Input
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="h-12"
                />
                <textarea
                  placeholder="Your message..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm min-h-[140px] focus:outline-none focus:ring-2 focus:ring-amber-600/30 resize-none"
                  required
                />
                <Button type="submit" className="w-full h-12 bg-neutral-900 hover:bg-neutral-800">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
