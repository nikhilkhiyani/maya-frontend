import Link from 'next/link'

const policyPages: Record<string, { title: string; content: string[] }> = {
  shipping: {
    title: 'Shipping & Delivery Policy',
    content: [
      'MAYA offers complimentary pan-India delivery on orders above ₹999. Standard delivery is 3–5 business days; remote locations may require additional time.',
      'All orders are fully insured during transit. You will receive email and SMS updates at each shipment milestone.',
      'Risk of loss transfers to you upon delivery. Please inspect your package upon receipt and report any visible damage within 24 hours.',
      'Shipping charges of ₹99 apply to orders below ₹999. Express delivery may be available on select products.',
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    content: [
      'How do I track my order? Visit Track Order and enter your order ID.',
      'What payment methods do you accept? We accept COD, UPI, cards, and net banking via Razorpay.',
      'Can I modify my order? Contact us within 2 hours of placing your order.',
      'Do you offer international shipping? Currently we ship within India only.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    content: [
      'We collect only the information necessary to process your orders and improve your experience.',
      'Your data is never sold to third parties.',
      'Payment information is processed securely through Razorpay.',
      'You may request deletion of your account data by contacting support@maya.com.',
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    content: [
      'Welcome to MAYA. By accessing our website or placing an order, you agree to these Terms & Conditions governing your use of our luxury e-commerce platform.',
      'Payment Policy: All prices are listed in INR and inclusive of applicable taxes unless stated otherwise. Online payments must be completed and verified before order processing. Cash on Delivery is available for eligible orders.',
      'Shipping Policy: Delivery timelines are estimates. MAYA is not liable for delays caused by couriers, customs, or force majeure events.',
      'Exchange Policy: Exchanges are permitted only for defective, damaged, or incorrect products received. Change-of-mind returns are not accepted. Exchange requests must be submitted within 7 days of delivery with mandatory photographic evidence.',
      'Refund Policy: Approved exchange refunds are processed within 2–5 business days after verification and receipt of returned goods, to the original payment method.',
      'Cancellation Policy: Orders may be cancelled before shipment. Once shipped, cancellation is not possible; exchange policy applies post-delivery.',
      'Privacy & Cookies: We process personal data per our Privacy and Cookie policies. Payment data is handled by certified payment providers.',
      'User Responsibilities: You must provide accurate shipping and contact information. Fraudulent orders or abuse of exchange policy may result in account suspension.',
      'Limitation of Liability: MAYA\'s liability is limited to the value of the purchased product. We are not liable for indirect, incidental, or consequential damages.',
      'Fraud Prevention: We reserve the right to verify payments, request additional documentation, and cancel suspicious transactions.',
    ],
  },
  refund: {
    title: 'Refund & Exchange Policy',
    content: [
      'Exchanges are available only for: (1) defective products, (2) damaged products, (3) incorrect products received. General change-of-mind exchanges are not permitted.',
      'Submit exchange requests within 7 days of delivery via your account dashboard. Mandatory image uploads are required.',
      'Refunds are issued to the original payment method within 2–5 business days after successful verification and receipt of the returned item.',
      'COD orders receive refunds via bank transfer. Sale items may be eligible for exchange only, subject to inspection.',
      'MAYA reserves the right to reject exchange requests that do not meet policy criteria or show evidence of misuse.',
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    content: [
      'We use cookies to maintain your session and cart.',
      'Analytics cookies help us understand how you use our site.',
      'You can disable cookies in your browser settings, but some features may not work.',
    ],
  },
  'size-guide': {
    title: 'Size Guide',
    content: [
      'S: Bust 32–34", Waist 26–28"',
      'M: Bust 34–36", Waist 28–30"',
      'L: Bust 36–38", Waist 30–32"',
      'XL: Bust 38–40", Waist 32–34"',
      'For custom sizing, contact us at support@maya.com.',
    ],
  },
  story: {
    title: 'Our Story',
    content: [
      'MAYA was born from a passion for Indo-Latin fusion fashion.',
      'Every piece is crafted with attention to detail, celebrating heritage while embracing modern design.',
      'We work with skilled artisans across India to bring you timeless elegance.',
    ],
  },
  careers: {
    title: 'Careers',
    content: [
      'Join our team of passionate designers, stylists, and technologists.',
      'Send your resume to careers@maya.com.',
      'We are always looking for talented individuals who share our vision.',
    ],
  },
  blog: {
    title: 'Blog',
    content: [
      'Style guides, trend reports, and behind-the-scenes stories coming soon.',
      'Subscribe to our newsletter to be notified when we launch.',
    ],
  },
  press: {
    title: 'Press',
    content: [
      'For media inquiries, contact press@maya.com.',
      'Download our brand kit and high-resolution images upon request.',
    ],
  },
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = policyPages[slug]

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-serif mb-4">Page Not Found</h1>
        <Link href="/" className="text-amber-700 hover:underline">Return Home</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-6">{page.title}</h1>
      <div className="space-y-4 text-neutral-600 leading-relaxed">
        {page.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-10 pt-8 border-t border-neutral-100">
        <Link href="/contact" className="text-amber-700 hover:underline text-sm">
          Have questions? Contact us →
        </Link>
      </div>
    </div>
  )
}
