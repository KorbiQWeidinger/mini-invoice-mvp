import Link from "next/link";
import { invoiceService } from "@/lib/database";

export default async function InvoicesPage() {
  const invoices = await invoiceService.getAll();

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
                Invoices
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your invoices and track payments
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link
                href="/invoices/new"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Invoice
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <input
                    type="date"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issue Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.invoice_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {invoice.customer_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.customer_email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(invoice.issue_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${invoice.total_amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/invoices/${invoice.id}`}
                              className="text-blue-600 hover:text-blue-500"
                            >
                              View
                            </Link>
                            <Link
                              href={`/invoices/${invoice.id}/edit`}
                              className="text-indigo-600 hover:text-indigo-500"
                            >
                              Edit
                            </Link>
                            <button className="text-red-600 hover:text-red-500">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{" "}
                      <span className="font-medium">{invoices.length}</span> of{" "}
                      <span className="font-medium">{invoices.length}</span>{" "}
                      results
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
