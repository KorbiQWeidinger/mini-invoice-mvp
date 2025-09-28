"use client";

import { useState, useEffect } from "react";
import { invoiceService, type Invoice } from "@/db/database";
import { PrelineConfirmationModal } from "../ui/PrelineModal";
import {
  DataTable,
  type DataTableColumn,
  type DataTableAction,
  type DataTableFilter,
} from "../ui/DataTable/index";
import { Eye, Edit, Trash2 } from "lucide-react";
import { PrelineBadge } from "../ui/PrelineBadge";
import { usePrelineReinit } from "@/client/common/hooks/usePrelineReinit";

interface InvoicesDataTableProps {
  initialInvoices: Invoice[];
}

export default function InvoicesDataTable({
  initialInvoices,
}: InvoicesDataTableProps) {
  usePrelineReinit();
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [filteredInvoices, setFilteredInvoices] =
    useState<Invoice[]>(initialInvoices);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    invoiceId: string | null;
    invoiceNumber: string;
  }>({
    isOpen: false,
    invoiceId: null,
    invoiceNumber: "",
  });

  // Refresh data when component mounts or when returning from other pages
  useEffect(() => {
    const refreshData = async () => {
      try {
        const updatedInvoices = await invoiceService.getAll();
        setInvoices(updatedInvoices);
        setFilteredInvoices(updatedInvoices);
      } catch (error) {
        console.error("Error refreshing invoices:", error);
      }
    };

    refreshData();

    // Refresh data when page becomes visible (user returns from another tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const openDeleteModal = (id: string, invoiceNumber: string) => {
    setDeleteModal({
      isOpen: true,
      invoiceId: id,
      invoiceNumber,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      invoiceId: null,
      invoiceNumber: "",
    });
  };

  const handleDelete = async () => {
    if (!deleteModal.invoiceId) return;

    try {
      await invoiceService.delete(deleteModal.invoiceId);
      setInvoices(
        invoices.filter((invoice) => invoice.id !== deleteModal.invoiceId)
      );
      setFilteredInvoices(
        filteredInvoices.filter(
          (invoice) => invoice.id !== deleteModal.invoiceId
        )
      );
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      // Show a more user-friendly error message
      alert(
        `Failed to delete invoice ${deleteModal.invoiceNumber}. Please try again.`
      );
    }
  };

  const handleRefresh = async () => {
    try {
      const updatedInvoices = await invoiceService.getAll();
      setInvoices(updatedInvoices);
      setFilteredInvoices(updatedInvoices);
    } catch (error) {
      console.error("Error refreshing invoices:", error);
      alert("Failed to refresh invoices. Please try again.");
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredInvoices(invoices);
      return;
    }

    const filtered = invoices.filter(
      (invoice) =>
        invoice.invoice_number.toLowerCase().includes(query.toLowerCase()) ||
        invoice.customer_name.toLowerCase().includes(query.toLowerCase()) ||
        invoice.customer_email?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredInvoices(filtered);
  };

  const handleFilter = (filters: Record<string, string>) => {
    let filtered = invoices;

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoice_number
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          invoice.customer_name
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          invoice.customer_email
            ?.toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(
        (invoice) => invoice.status === filters.status
      );
    }

    setFilteredInvoices(filtered);
  };

  // Define columns for the DataTable
  const columns: DataTableColumn<Invoice>[] = [
    {
      key: "invoice_number",
      header: "Invoice #",
      render: (invoice: Invoice) => (
        <span className="font-medium text-text-primary">
          {invoice.invoice_number}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (invoice: Invoice) => (
        <div>
          <div className="text-sm text-text-primary font-medium">
            {invoice.customer_name}
          </div>
          <div className="text-sm text-text-secondary">
            {invoice.customer_email}
          </div>
        </div>
      ),
    },
    {
      key: "issue_date",
      header: "Issue Date",
      render: (invoice: Invoice) => (
        <span className="text-text-secondary">
          {new Date(invoice.issue_date).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "due_date",
      header: "Due Date",
      render: (invoice: Invoice) => (
        <span className="text-text-secondary">
          {new Date(invoice.due_date).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "total_amount",
      header: "Amount",
      render: (invoice: Invoice) => (
        <span className="text-text-secondary">
          ${invoice.total_amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (invoice: Invoice) => {
        const getStatusVariant = (status: string) => {
          switch (status) {
            case "paid":
              return "success";
            case "sent":
              return "info";
            case "draft":
              return "neutral";
            case "overdue":
              return "danger";
            default:
              return "neutral";
          }
        };

        return (
          <PrelineBadge variant={getStatusVariant(invoice.status)}>
            {invoice.status}
          </PrelineBadge>
        );
      },
    },
  ];

  // Define actions for the DataTable
  const actions: DataTableAction<Invoice>[] = [
    {
      label: "View Invoice",
      icon: <Eye className="w-4 h-4" />,
      onClick: (invoice: Invoice) => {
        window.location.href = `/invoices/${invoice.id}`;
      },
    },
    {
      label: "Edit Invoice",
      icon: <Edit className="w-4 h-4" />,
      onClick: (invoice: Invoice) => {
        window.location.href = `/invoices/${invoice.id}/edit`;
      },
    },
    {
      label: "Delete Invoice",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (invoice: Invoice) => {
        openDeleteModal(invoice.id, invoice.invoice_number);
      },
      variant: "danger",
    },
  ];

  // Define filters for the DataTable
  const filters: DataTableFilter[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "draft", label: "Draft" },
        { value: "sent", label: "Sent" },
        { value: "paid", label: "Paid" },
        { value: "overdue", label: "Overdue" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        data={filteredInvoices}
        columns={columns}
        actions={actions}
        searchable={true}
        filterable={true}
        refreshable={true}
        onRefresh={handleRefresh}
        onSearch={handleSearch}
        onFilter={handleFilter}
        title="Invoice Management"
        emptyMessage="No invoices found"
        filters={filters}
      />

      {/* Delete Confirmation Modal */}
      <PrelineConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${deleteModal.invoiceNumber}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
