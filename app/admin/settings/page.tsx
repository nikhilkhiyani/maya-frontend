'use client'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif text-neutral-900">Settings</h1>
        <p className="text-neutral-500 mt-1">Store configuration</p>
      </div>
      <div className="bg-white rounded-2xl border border-neutral-100 p-8 text-center text-neutral-500">
        <p className="font-medium text-neutral-700 mb-2">Store settings coming soon</p>
        <p className="text-sm">Configure brand, SMTP, payment gateway, and taxes from here.</p>
      </div>
    </div>
  )
}
