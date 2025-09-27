import Link from "next/link";
import { invoiceService, type InvoiceItem } from "@/lib/database";
import { notFound } from "next/navigation";

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { id } = await params;
  
  try {
    const invoice = await invoiceService.getById(id);
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Mini-Invoice MVP
                </h1>
              </div>
              <nav className="flex space-x-8">
                <Link
                  href="/dashboard"
                  className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/invoices"
                  className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  Invoices
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Page Header */}
            <div className="md:flex md:items-center md:justify-between mb-8">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Invoice {invoice.invoice_number}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Created on {new Date(invoice.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                <Link
                  href={`/invoices/${invoice.id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Edit Invoice
                </Link>
                <Link
                  href="/invoices"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Back to Invoices
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Invoice Details */}
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Customer Information
                    </h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{invoice.customer_name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900">{invoice.customer_email || "N/A"}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {invoice.customer_address || "N/A"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Invoice Information */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Invoice Information
                    </h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Invoice Number</dt>
                        <dd className="mt-1 text-sm text-gray-900">{invoice.invoice_number}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              invoice.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : invoice.status === "sent"
                                ? "bg-blue-100 text-blue-800"
                                : invoice.status === "draft"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(invoice.issue_date).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Notes
                      </h3>
                      <p className="text-sm text-gray-900">{invoice.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Invoice Items and Totals */}
              <div className="space-y-6">
                {/* Invoice Items */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Invoice Items
                    </h3>
                    {invoice.invoice_items && invoice.invoice_items.length > 0 ? (
                      <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Unit Price
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {invoice.invoice_items.map((item: InvoiceItem) => (
                              <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ${item.unit_price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ${item.line_total.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No items found for this invoice.</p>
                    )}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Totals
                    </h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
                        <dd className="text-sm text-gray-900">${invoice.subtotal.toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">
                          Tax ({invoice.tax_rate}%)
                        </dt>
                        <dd className="text-sm text-gray-900">${invoice.tax_amount.toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-3">
                        <dt className="text-base font-medium text-gray-900">Total</dt>
                        <dd className="text-base font-medium text-gray-900">
                          ${invoice.total_amount.toFixed(2)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } catch {
    notFound();
  }
}
