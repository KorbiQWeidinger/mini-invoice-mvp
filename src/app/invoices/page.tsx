import Link from "next/link";
import { invoiceService } from "@/lib/database";
import InvoicesDataTable from "@/components/InvoicesDataTable";
import Header from "@/components/Header";

export default async function InvoicesPage() {
  const invoices = await invoiceService.getAll();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                Invoices
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your invoices and track payments
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link
                href="/invoices/new"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Invoice
              </Link>
            </div>
          </div>

          {/* Invoices Data Table */}
          <InvoicesDataTable initialInvoices={invoices} />
        </div>
      </main>
    </div>
  );
}
