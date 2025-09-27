import Link from "next/link";
import { invoiceService } from "@/lib/database";
import InvoicesDataTable from "@/components/InvoicesDataTable";
import { Plus } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export default async function InvoicesPage() {
  const invoices = await invoiceService.getAll();
  
  // Debug logging
  console.log("InvoicesPage - invoices count:", invoices.length);
  console.log("InvoicesPage - invoices:", invoices.map(inv => ({ id: inv.id, invoice_number: inv.invoice_number })));

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
