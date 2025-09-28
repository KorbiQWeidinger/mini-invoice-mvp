"use client";

import { type Invoice, type InvoiceItem } from "@/db/database";
import { PrelineCard } from "@/client/common/components/ui/PrelineCard";
import { DataTable } from "@/client/common/components/ui/DataTable";
import type { DataTableColumn } from "@/client/common/components/ui/DataTable";

interface InvoiceViewProps {
  invoice: Invoice & { invoice_items?: InvoiceItem[] };
  isPreview?: boolean;
}

export function InvoiceView({ invoice, isPreview = false }: InvoiceViewProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  // Define columns for the DataTable
  const invoiceItemColumns: DataTableColumn<InvoiceItem>[] = [
    {
      key: "description",
      header: "Description",
      sortable: true,
      searchable: true,
      render: (item) => (
        <span className="text-text-primary font-medium">
          {item.description}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      sortable: true,
      render: (item) => (
        <span className="text-text-secondary">{item.quantity}</span>
      ),
    },
    {
      key: "unit_price",
      header: "Unit Price",
      sortable: true,
      render: (item) => (
        <span className="text-text-secondary">
          {formatCurrency(item.unit_price)}
        </span>
      ),
    },
    {
      key: "line_total",
      header: "Total",
      sortable: true,
      render: (item) => (
        <span className="text-text-primary font-medium">
          {formatCurrency(item.line_total)}
        </span>
      ),
    },
  ];

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-success-bg text-success-text";
      case "sent":
        return "bg-info-bg text-info-text";
      case "draft":
        return "bg-bg-tertiary text-text-secondary";
      default:
        return "bg-error-bg text-error-text";
    }
  };

  const containerClass = isPreview
    ? "max-w-none p-4 bg-white shadow-md border border-border-primary rounded-lg"
    : "max-w-4xl mx-auto p-8 bg-white shadow-lg";

  return (
    <PrelineCard className={containerClass}>
      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-border-primary">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">INVOICE</h1>
          <p className="text-text-secondary">
            Invoice #{invoice.invoice_number}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
              invoice.status
            )}`}
          >
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Company and Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
        {/* Company Info */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">From</h3>
          <div className="space-y-1">
            <p className="text-text-primary font-medium">Your Company Name</p>
            <p className="text-text-secondary">123 Business Street</p>
            <p className="text-text-secondary">City, State 12345</p>
            <p className="text-text-secondary">contact@company.com</p>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Bill To
          </h3>
          <div className="space-y-1">
            <p className="text-text-primary font-medium">
              {invoice.customer_name}
            </p>
            {invoice.customer_email && (
              <p className="text-text-secondary">{invoice.customer_email}</p>
            )}
            {invoice.customer_address && (
              <div className="text-text-secondary whitespace-pre-line">
                {invoice.customer_address}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-2">
            Issue Date
          </h4>
          <p className="text-text-primary">{formatDate(invoice.issue_date)}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-2">
            Due Date
          </h4>
          <p className="text-text-primary">{formatDate(invoice.due_date)}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-2">
            Created
          </h4>
          <p className="text-text-primary">{formatDate(invoice.created_at)}</p>
        </div>
      </div>

      {/* Invoice Items Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Items</h3>
        <DataTable
          key={`invoice-items-table-${(invoice.invoice_items || []).length}-${(
            invoice.invoice_items || []
          )
            .map((i) => i.id)
            .join("-")}`}
          data={invoice.invoice_items || []}
          columns={invoiceItemColumns}
          searchable={false}
          filterable={false}
          refreshable={false}
          paginated={false}
          emptyMessage="No items found for this invoice."
          className="[&_.bg-bg-primary]:!bg-transparent [&_table]:border-collapse [&_th]:text-right [&_th:first-child]:text-left [&_td]:text-right [&_td:first-child]:text-left [&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-4"
        />
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-sm">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Subtotal</span>
              <span className="text-text-primary">
                {formatCurrency(invoice.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">
                Tax ({invoice.tax_rate}%)
              </span>
              <span className="text-text-primary">
                {formatCurrency(invoice.tax_amount)}
              </span>
            </div>
            <div className="border-t-2 border-border-primary pt-3">
              <div className="flex justify-between">
                <span className="text-xl font-bold text-text-primary">
                  Total
                </span>
                <span className="text-xl font-bold text-text-primary">
                  {formatCurrency(invoice.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {invoice.notes && (
        <div className="border-t border-border-primary pt-6">
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            Notes
          </h3>
          <p className="text-text-secondary whitespace-pre-line">
            {invoice.notes}
          </p>
        </div>
      )}
    </PrelineCard>
  );
}
