'use client'

import { useEffect, useState } from 'react'
import { invoiceService, type Invoice } from '@/lib/database'

export default function TestPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const data = await invoiceService.getAll()
        setInvoices(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch invoices')
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading invoices...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p>{error}</p>
          <p className="mt-4 text-sm text-gray-600">
            Make sure to configure your Supabase credentials in .env.local
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
        
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          ✅ Successfully connected to Supabase! Found {invoices.length} invoices.
        </div>

        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="border rounded-lg p-4 bg-white shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{invoice.invoice_number}</h3>
                  <p className="text-gray-600">{invoice.customer_name}</p>
                  <p className="text-sm text-gray-500">{invoice.customer_email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${invoice.total_amount.toFixed(2)}</p>
                  <span className={`px-2 py-1 rounded text-xs ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    invoice.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {invoices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No invoices found. Run the database migration to add sample data.
          </div>
        )}
      </div>
    </div>
  )
}
