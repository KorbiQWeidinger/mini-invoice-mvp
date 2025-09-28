import { invoiceService } from "@/db/database";
import { FileText, CheckCircle, Send, Edit } from "lucide-react";
import PageHeader from "@/client/common/components/PageHeader";
import { PrelineButton } from "@/client/common/components/ui/PrelineButton";
import { PrelineCard } from "@/client/common/components/ui/PrelineCard";
import { PrelineBadge } from "@/client/common/components/ui/PrelineBadge";

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

  // Get recent invoices (last 3)
  const recentInvoices = invoices
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 3);

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
        <PrelineCard
          variant="statistic"
          hover
          icon={<FileText />}
          iconColor="primary"
        >
          <div className="flex items-center">
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
        <PrelineCard
          variant="statistic"
          hover
          icon={<CheckCircle />}
          iconColor="success"
        >
          <div className="flex items-center">
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
        <PrelineCard
          variant="statistic"
          hover
          icon={<Send />}
          iconColor="warning"
        >
          <div className="flex items-center">
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
        <PrelineCard
          variant="statistic"
          hover
          icon={<Edit />}
          iconColor="neutral"
        >
          <div className="flex items-center">
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
          <PrelineButton variant="ghost" size="sm" href="/invoices">
            View all invoices →
          </PrelineButton>
        }
        variant="elevated"
      >
        {recentInvoices.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-border-primary">
              <thead className="bg-bg-tertiary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-bg-primary divide-y divide-border-primary">
                {recentInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-bg-hover transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {invoice.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {new Date(invoice.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      ${invoice.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PrelineBadge
                        variant={
                          invoice.status === "paid"
                            ? "success"
                            : invoice.status === "sent"
                            ? "info"
                            : invoice.status === "draft"
                            ? "neutral"
                            : "danger"
                        }
                      >
                        {invoice.status}
                      </PrelineBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-secondary">
              No invoices found. Create your first invoice to get started.
            </p>
            <PrelineButton href="/invoices">Create Invoice</PrelineButton>
          </div>
        )}
      </PrelineCard>
    </div>
  );
}
