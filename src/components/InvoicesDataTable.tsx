"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { invoiceService, type Invoice } from "@/lib/database";
import ConfirmModal from "./ConfirmModal";
import { Search, ChevronDown, RefreshCw } from "lucide-react";

interface InvoicesDataTableProps {
  initialInvoices: Invoice[];
}

export default function InvoicesDataTable({
  initialInvoices,
}: InvoicesDataTableProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
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
      } catch (error) {
        console.error("Error refreshing invoices:", error);
      }
    };

    refreshData();
  }, []);

  useEffect(() => {
    let filtered = invoices;

    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoice_number
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.customer_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.customer_email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter]);

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
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert("Failed to delete invoice");
    }
  };

  const handleRefresh = async () => {
    try {
      const updatedInvoices = await invoiceService.getAll();
      setInvoices(updatedInvoices);
    } catch (error) {
      console.error("Error refreshing invoices:", error);
      alert("Failed to refresh invoices");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-bg-primary shadow-lg rounded-xl border border-border-primary p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Invoice Management</h3>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors duration-200"
            title="Refresh invoices"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="flex-shrink-0 w-4 h-4 text-text-muted" />
              </div>
              <input
                type="text"
                id="search"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 px-4 ps-10 block w-full border border-border-primary rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary placeholder-text-muted"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Status
            </label>
            <div className="hs-dropdown relative inline-flex">
              <button
                id="hs-dropdown-status"
                type="button"
                className="hs-dropdown-toggle py-2 px-4 pe-9 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-border-primary bg-bg-primary text-text-primary shadow-sm hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none"
              >
                {statusFilter
                  ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
                  : "All Statuses"}
                <ChevronDown className="hs-dropdown-open:rotate-180 w-4 h-4" />
              </button>

              <div
                className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-bg-primary shadow-md rounded-lg p-2 mt-2 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="hs-dropdown-status"
              >
                <button
                  onClick={() => setStatusFilter("")}
                  className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-text-primary hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  All Statuses
                </button>
                <button
                  onClick={() => setStatusFilter("draft")}
                  className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-text-primary hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  Draft
                </button>
                <button
                  onClick={() => setStatusFilter("sent")}
                  className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-text-primary hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  Sent
                </button>
                <button
                  onClick={() => setStatusFilter("paid")}
                  className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-text-primary hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  Paid
                </button>
                <button
                  onClick={() => setStatusFilter("overdue")}
                  className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-text-primary hover:bg-bg-hover focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  Overdue
                </button>
              </div>
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label
              htmlFor="dateRange"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Date Range
            </label>
            <input
              type="date"
              id="dateRange"
              className="py-2 px-4 block w-full border border-border-primary rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary"
            />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-bg-primary shadow-lg rounded-xl border border-border-primary overflow-hidden">
        <div className="overflow-x-auto">
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
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-bg-primary divide-y divide-border-primary">
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-bg-hover transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                    {invoice.invoice_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-primary font-medium">
                      {invoice.customer_name}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {invoice.customer_email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {new Date(invoice.issue_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {new Date(invoice.due_date).toLocaleDateString()}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="text-brand-primary hover:text-brand-primary-hover transition-colors duration-200"
                      >
                        View
                      </Link>
                      <Link
                        href={`/invoices/${invoice.id}/edit`}
                        className="text-brand-primary hover:text-brand-primary-hover transition-colors duration-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() =>
                          openDeleteModal(invoice.id, invoice.invoice_number)
                        }
                        className="text-error hover:text-error-text transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Results Summary */}
        <div className="bg-bg-tertiary px-6 py-3 border-t border-border-primary">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              Showing{" "}
              <span className="font-medium">{filteredInvoices.length}</span> of{" "}
              <span className="font-medium">{invoices.length}</span> invoices
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
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
