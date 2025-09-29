import { invoiceService } from "@/db/database";
import { getCurrentOrgIdFromCookies } from "@/server/orgs/current-org";
import InvoicesDataTable from "@/client/features/invoice/InvoicesDataTable";
import { Plus } from "lucide-react";
import { PageHeader } from "@/client/common/components/PageHeader";
import { PrelineButton } from "@/client/common/components/ui/PrelineButton";

// Disable caching for this page to ensure fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InvoicesPage() {
  // Force fresh data by disabling cache
  const organizationId = await getCurrentOrgIdFromCookies();
  const invoices = await invoiceService.getAll({ organizationId: organizationId ?? undefined });

  return (
    <div className="p-6">
      {/* Page Header */}
      <PageHeader
        title="Invoices"
        subtitle="Manage your invoices and track payments"
        actions={
          <PrelineButton
            href="/invoices/new"
            icon={<Plus className="w-4 h-4" />}
          >
            Create Invoice
          </PrelineButton>
        }
      />

      {/* Invoices Data Table */}
      <InvoicesDataTable initialInvoices={invoices} />
    </div>
  );
}
