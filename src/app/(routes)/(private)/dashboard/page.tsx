import { invoiceService } from "@/db/database";
import { FileText, CheckCircle, Send, Edit } from "lucide-react";
import { PageHeader } from "@/client/common/components/PageHeader";
import { PrelineButton } from "@/client/common/components/ui/PrelineButton";
import { PrelineCard } from "@/client/common/components/ui/PrelineCard";
import { DashboardRecentInvoices } from "@/client/features/dashboard/DashboardRecentInvoices";

// Disable caching for this page to ensure fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  // Force fresh data by disabling cache
  const invoices = await invoiceService.getAll();

  // Calculate statistics
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;
  const sentInvoices = invoices.filter((inv) => inv.status === "sent").length;
  const draftInvoices = invoices.filter((inv) => inv.status === "draft").length;

  // Get recent invoices (last 5 for better DataTable display)
  const recentInvoices = invoices
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <PageHeader
        title="Dashboard"
        subtitle="Manage your invoices and track payments with ease"
      />
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Invoices */}
        <PrelineCard variant="statistic" hover>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-icon-primary to-icon-primary-hover rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-text-on-primary" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-text-secondary truncate">
                  Total Invoices
                </dt>
                <dd className="text-2xl font-bold text-text-primary">
                  {totalInvoices}
                </dd>
              </dl>
            </div>
          </div>
        </PrelineCard>

        {/* Paid Invoices */}
        <PrelineCard variant="statistic" hover>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-icon-success to-icon-success-hover rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-text-on-success" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-text-secondary truncate">
                  Paid Invoices
                </dt>
                <dd className="text-2xl font-bold text-text-primary">
                  {paidInvoices}
                </dd>
              </dl>
            </div>
          </div>
        </PrelineCard>

        {/* Sent Invoices */}
        <PrelineCard variant="statistic" hover>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-icon-warning to-icon-warning-hover rounded-xl flex items-center justify-center shadow-lg">
              <Send className="w-6 h-6 text-text-on-warning" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-text-secondary truncate">
                  Sent Invoices
                </dt>
                <dd className="text-2xl font-bold text-text-primary">
                  {sentInvoices}
                </dd>
              </dl>
            </div>
          </div>
        </PrelineCard>

        {/* Draft Invoices */}
        <PrelineCard variant="statistic" hover>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-icon-neutral to-icon-neutral-hover rounded-xl flex items-center justify-center shadow-lg">
              <Edit className="w-6 h-6 text-text-on-primary" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-text-secondary truncate">
                  Draft Invoices
                </dt>
                <dd className="text-2xl font-bold text-text-primary">
                  {draftInvoices}
                </dd>
              </dl>
            </div>
          </div>
        </PrelineCard>
      </div>

      {/* Recent Invoices */}
      <PrelineCard
        title="Recent Invoices"
        actions={
          recentInvoices.length > 0 && (
            <PrelineButton variant="ghost" size="sm" href="/invoices">
              View all invoices →
            </PrelineButton>
          )
        }
        variant="elevated"
      >
        {recentInvoices.length > 0 ? (
          <DashboardRecentInvoices invoices={recentInvoices} />
        ) : (
          <div className="text-center py-8">
            <p className="text-text-secondary mb-4">
              No invoices found. Create your first invoice to get started.
            </p>
            <PrelineButton href="/invoices/new">Create Invoice</PrelineButton>
          </div>
        )}
      </PrelineCard>
    </div>
  );
}
