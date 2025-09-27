import Link from "next/link";
import { invoiceService } from "@/lib/database";
import InvoicesDataTable from "@/components/InvoicesDataTable";
import Header from "@/components/Header";
import { Plus } from "lucide-react";

export default async function InvoicesPage() {
  const invoices = await invoiceService.getAll();

  return (
    <div className="min-h-screen bg-bg-secondary transition-colors duration-200">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-text-primary sm:text-3xl sm:truncate">
                Invoices
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Manage your invoices and track payments
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link
                href="/invoices/new"
                className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brand-primary text-white hover:bg-brand-primary-hover disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
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
