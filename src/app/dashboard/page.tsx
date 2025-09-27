import Link from "next/link";
import { invoiceService } from "@/lib/database";
import Header from "@/components/Header";
import { FileText, CheckCircle, Send, Edit } from "lucide-react";

export default async function DashboardPage() {
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
    <div className="min-h-screen bg-bg-secondary transition-colors duration-200">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Welcome to Mini-Invoice MVP
            </h1>
            <p className="text-text-secondary">
              Manage your invoices and track payments with ease
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Invoices */}
            <div className="bg-bg-primary overflow-hidden shadow-lg rounded-xl border border-border-primary transition-all duration-200 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-icon-primary to-icon-primary-hover rounded-xl flex items-center justify-center shadow-lg">
                      <FileText className="w-6 h-6 text-text-on-primary" />
                    </div>
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
              </div>
            </div>

            {/* Paid Invoices */}
            <div className="bg-bg-primary overflow-hidden shadow-lg rounded-xl border border-border-primary transition-all duration-200 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-icon-success to-icon-success-hover rounded-xl flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-6 h-6 text-text-on-success" />
                    </div>
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
              </div>
            </div>

            {/* Sent Invoices */}
            <div className="bg-bg-primary overflow-hidden shadow-lg rounded-xl border border-border-primary transition-all duration-200 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-icon-warning to-icon-warning-hover rounded-xl flex items-center justify-center shadow-lg">
                      <Send className="w-6 h-6 text-text-on-warning" />
                    </div>
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
              </div>
            </div>

            {/* Draft Invoices */}
            <div className="bg-bg-primary overflow-hidden shadow-lg rounded-xl border border-border-primary transition-all duration-200 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-icon-neutral to-icon-neutral-hover rounded-xl flex items-center justify-center shadow-lg">
                      <Edit className="w-6 h-6 text-text-on-primary" />
                    </div>
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
              </div>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-bg-primary shadow-lg rounded-xl border border-border-primary">
            <div className="px-6 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg leading-6 font-semibold text-text-primary">
                  Recent Invoices
                </h3>
                <Link
                  href="/invoices"
                  className="text-brand-primary hover:text-brand-primary-hover text-sm font-medium transition-colors duration-200"
                >
                  View all invoices →
                </Link>
              </div>

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
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
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
                  <Link
                    href="/invoices"
                    className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brand-primary text-text-on-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    Create Invoice
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
