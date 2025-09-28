"use client";

import { useRouter } from "next/navigation";
import { Eye, Edit } from "lucide-react";
import { DataTable } from "@/client/common/components/ui/DataTable";
import type {
  DataTableColumn,
  DataTableAction,
} from "@/client/common/components/ui/DataTable";
import { PrelineBadge } from "@/client/common/components/ui/PrelineBadge";
import type { Invoice } from "@/db/database";

interface DashboardRecentInvoicesProps {
  invoices: Invoice[];
}

export function DashboardRecentInvoices({
  invoices,
}: DashboardRecentInvoicesProps) {
  const router = useRouter();

  // Define columns for the recent invoices DataTable
  const columns: DataTableColumn<Invoice>[] = [
    {
      key: "customer_name",
      header: "Customer",
      sortable: true,
      searchable: true,
      render: (invoice: Invoice) => (
        <span className="text-text-secondary">{invoice.customer_name}</span>
      ),
    },
    {
      key: "issue_date",
      header: "Date",
      sortable: true,
      render: (invoice: Invoice) => (
        <span className="text-text-secondary">
          {new Date(invoice.issue_date).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "total_amount",
      header: "Amount",
      sortable: true,
      render: (invoice: Invoice) => (
        <span className="text-text-secondary">
          ${invoice.total_amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      searchable: true,
      render: (invoice: Invoice) => (
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
      ),
    },
  ];

  // Define actions for the recent invoices DataTable
  const actions: DataTableAction<Invoice>[] = [
    {
      label: "View Invoice",
      icon: <Eye className="w-4 h-4" />,
      onClick: (invoice: Invoice) => {
        router.push(`/invoices/${invoice.id}`);
      },
      variant: "secondary",
    },
    {
      label: "Edit Invoice",
      icon: <Edit className="w-4 h-4" />,
      onClick: (invoice: Invoice) => {
        router.push(`/invoices/${invoice.id}/edit`);
      },
      variant: "ghost",
      disabled: (invoice: Invoice) => invoice.status === "paid",
    },
  ];

  return (
    <DataTable
      data={invoices.slice(0, 3)}
      columns={columns}
      actions={actions}
      searchable={false}
      filterable={false}
      refreshable={false}
      paginated={false}
      emptyMessage="No recent invoices found"
    />
  );
}
