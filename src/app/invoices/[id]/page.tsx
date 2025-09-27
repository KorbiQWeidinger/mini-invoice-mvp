import Link from "next/link";
import { invoiceService, type InvoiceItem } from "@/lib/database";
import { notFound } from "next/navigation";

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { id } = await params;

  try {
    const invoice = await invoiceService.getById(id);

    return (
      <div className="min-h-screen bg-bg-secondary">
        {/* Header */}
        <header className="bg-bg-primary shadow-sm border-b border-border-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-text-primary">
                  Mini-Invoice MVP
                </h1>
              </div>
              <nav className="flex space-x-8">
                <Link
                  href="/dashboard"
                  className="text-text-secondary hover:text-brand-primary px-3 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/invoices"
                  className="text-text-primary hover:text-brand-primary px-3 py-2 text-sm font-medium"
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
                <h2 className="text-2xl font-bold leading-7 text-text-primary sm:text-3xl sm:truncate">
                  Invoice {invoice.invoice_number}
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  Created on {new Date(invoice.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                <Link
                  href={`/invoices/${invoice.id}/edit`}
                  className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-border-primary text-text-secondary bg-bg-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  Edit Invoice
                </Link>
                <Link
                  href="/invoices"
                  className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brand-primary text-white hover:bg-brand-primary-hover disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  Back to Invoices
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Invoice Details */}
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="bg-bg-primary shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-text-primary mb-4">
                      Customer Information
                    </h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-text-secondary">
                          Name
                        </dt>
                        <dd className="mt-1 text-sm text-text-primary">
                          {invoice.customer_name}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-text-secondary">
                          Email
                        </dt>
                        <dd className="mt-1 text-sm text-text-primary">
                          {invoice.customer_email || "N/A"}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-text-secondary">
                          Address
                        </dt>
                        <dd className="mt-1 text-sm text-text-primary">
                          {invoice.customer_address || "N/A"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Invoice Information */}
                <div className="bg-bg-primary shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-text-primary mb-4">
                      Invoice Information
                    </h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-text-secondary">
                          Invoice Number
                        </dt>
                        <dd className="mt-1 text-sm text-text-primary">
                          {invoice.invoice_number}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-text-secondary">
                          Status
                        </dt>
                        <dd className="mt-1">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              invoice.status === "paid"
                                ? "bg-success-bg text-success-text"
                                : invoice.status === "sent"
                                ? "bg-info-bg text-info-text"
                                : invoice.status === "draft"
                                ? "bg-bg-tertiary text-text-secondary"
                                : "bg-error-bg text-error-text"
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-text-secondary">
                          Issue Date
                        </dt>
                        <dd className="mt-1 text-sm text-text-primary">
                          {new Date(invoice.issue_date).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-text-secondary">
                          Due Date
                        </dt>
                        <dd className="mt-1 text-sm text-text-primary">
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                  <div className="bg-bg-primary shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-text-primary mb-4">
                        Notes
                      </h3>
                      <p className="text-sm text-text-primary">
                        {invoice.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Invoice Items and Totals */}
              <div className="space-y-6">
                {/* Invoice Items */}
                <div className="bg-bg-primary shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-text-primary mb-4">
                      Invoice Items
                    </h3>
                    {invoice.invoice_items &&
                    invoice.invoice_items.length > 0 ? (
                      <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-bg-tertiary">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Description
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Quantity
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Unit Price
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-bg-primary divide-y divide-gray-200">
                            {invoice.invoice_items.map((item: InvoiceItem) => (
                              <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                                  {item.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                  {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                  ${item.unit_price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                  ${item.line_total.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-text-secondary">
                        No items found for this invoice.
                      </p>
                    )}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-bg-primary shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-text-primary mb-4">
                      Totals
                    </h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-text-secondary">
                          Subtotal
                        </dt>
                        <dd className="text-sm text-text-primary">
                          ${invoice.subtotal.toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-text-secondary">
                          Tax ({invoice.tax_rate}%)
                        </dt>
                        <dd className="text-sm text-text-primary">
                          ${invoice.tax_amount.toFixed(2)}
                        </dd>
                      </div>
                      <div className="flex justify-between border-t border-border-primary pt-3">
                        <dt className="text-base font-medium text-text-primary">
                          Total
                        </dt>
                        <dd className="text-base font-medium text-text-primary">
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
