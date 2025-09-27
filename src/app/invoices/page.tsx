import Link from "next/link";
import { invoiceService } from "@/lib/database";
import InvoicesDataTable from "@/components/InvoicesDataTable";
import { Plus } from "lucide-react";
import PageHeader from "@/components/PageHeader";

// Disable caching for this page to ensure fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InvoicesPage() {
  // Force fresh data by disabling cache
  const invoices = await invoiceService.getAll();

  return (
    <div className="p-6">
      {/* Page Header */}
      <PageHeader
        title="Invoices"
        subtitle="Manage your invoices and track payments"
        actions={
          <Link
            href="/invoices/new"
            className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brand-primary text-text-on-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Link>
        }
      />

      {/* Invoices Data Table */}
      <InvoicesDataTable initialInvoices={invoices} />
    </div>
  );
}
