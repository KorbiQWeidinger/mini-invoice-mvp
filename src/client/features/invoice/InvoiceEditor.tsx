"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  type InvoiceInsert,
  type InvoiceItemInsert,
  type InvoiceItem,
  type Invoice,
} from "@/db/database";
import { PrelineInput } from "@/client/common/components/ui/PrelineInput";
import { PrelineButton } from "@/client/common/components/ui/PrelineButton";
import { PrelineTextarea } from "@/client/common/components/ui/PrelineTextarea";
import { PrelineCard } from "@/client/common/components/ui/PrelineCard";
import { PrelineDropdown } from "@/client/common/components/ui/PrelineDropdown";
import { DataTable } from "@/client/common/components/ui/DataTable";
import type {
  DataTableColumn,
  DataTableAction,
} from "@/client/common/components/ui/DataTable/types";
import { InvoiceView } from "./InvoiceView";

interface InvoiceEditorProps {
  initialInvoice?: Partial<InvoiceInsert>;
  initialItems?: InvoiceItem[];
  onSubmit: (
    invoice: InvoiceInsert,
    items: InvoiceItemInsert[]
  ) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

interface InvoiceItemForm extends Record<string, unknown> {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

interface NewItemForm {
  description: string;
  quantity: number;
  unit_price: number;
}

export function InvoiceEditor({
  initialInvoice,
  initialItems = [],
  onSubmit,
  loading = false,
  submitLabel = "Create Invoice",
}: InvoiceEditorProps) {
  // Generate stable values for preview to avoid hydration issues
  const [previewInvoiceNumber] = useState(() => `INV-PREVIEW`);
  const [previewDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Status options for the dropdown
  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" },
  ];
  const [invoice, setInvoice] = useState<Partial<InvoiceInsert>>({
    invoice_number: "",
    customer_name: "",
    customer_email: "",
    customer_address: "",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "draft",
    subtotal: 0,
    tax_rate: 10,
    tax_amount: 0,
    total_amount: 0,
    notes: "",
    ...initialInvoice,
  });

  const [items, setItems] = useState<InvoiceItemForm[]>(() => {
    const mappedItems =
      initialItems.length > 0
        ? initialItems.map((item) => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            line_total: item.line_total,
          }))
        : [];
    return mappedItems;
  });

  const [newItem, setNewItem] = useState<NewItemForm>({
    description: "",
    quantity: 1,
    unit_price: 0,
  });

  const calculateTotals = (items: InvoiceItemForm[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.line_total, 0);
    const taxAmount = (subtotal * (invoice.tax_rate || 0)) / 100;
    const total = subtotal + taxAmount;

    setInvoice((prev) => ({
      ...prev,
      subtotal,
      tax_amount: taxAmount,
      total_amount: total,
    }));
  };

  // Calculate totals when component mounts with initial items
  useEffect(() => {
    if (initialItems.length > 0 && items.length > 0) {
      calculateTotals(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const addItem = () => {
    if (!newItem.description.trim()) return;

    const lineTotal = newItem.quantity * newItem.unit_price;
    const itemToAdd: InvoiceItemForm = {
      id: Date.now().toString(),
      description: newItem.description,
      quantity: newItem.quantity,
      unit_price: newItem.unit_price,
      line_total: lineTotal,
    };

    const newItems = [...items, itemToAdd];
    setItems(newItems);
    calculateTotals(newItems);

    // Clear the form
    setNewItem({
      description: "",
      quantity: 1,
      unit_price: 0,
    });
  };

  const removeItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
    calculateTotals(newItems);
  };

  const updateNewItem = (field: keyof NewItemForm, value: string | number) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceData: InvoiceInsert = {
      invoice_number: invoice.invoice_number || `INV-${Date.now()}`,
      customer_name: invoice.customer_name || "",
      customer_email: invoice.customer_email || null,
      customer_address: invoice.customer_address || null,
      issue_date: invoice.issue_date || new Date().toISOString().split("T")[0],
      due_date: invoice.due_date || new Date().toISOString().split("T")[0],
      status: invoice.status || "draft",
      subtotal: invoice.subtotal || 0,
      tax_rate: invoice.tax_rate || 0,
      tax_amount: invoice.tax_amount || 0,
      total_amount: invoice.total_amount || 0,
      notes: invoice.notes || null,
    };

    const itemsData: InvoiceItemInsert[] = items
      .filter((item) => item.description.trim())
      .map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
        invoice_id: "", // This will be set by the parent component
      }));

    await onSubmit(invoiceData, itemsData);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  // Data table configuration
  const itemColumns: DataTableColumn<InvoiceItemForm>[] = [
    {
      key: "description",
      header: "Description",
      sortable: true,
      searchable: true,
      render: (item) => (
        <div className="font-medium text-text-primary">{item.description}</div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      sortable: true,
      render: (item) => (
        <div className="text-center text-text-secondary">{item.quantity}</div>
      ),
    },
    {
      key: "unit_price",
      header: "Unit Price",
      sortable: true,
      render: (item) => (
        <div className="text-center text-text-secondary">
          {formatCurrency(item.unit_price)}
        </div>
      ),
    },
    {
      key: "line_total",
      header: "Line Total",
      sortable: true,
      render: (item) => (
        <div className="text-right font-medium text-text-primary">
          {formatCurrency(item.line_total)}
        </div>
      ),
    },
  ];

  const itemActions: DataTableAction<InvoiceItemForm>[] = [
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item) => removeItem(item.id),
      variant: "danger",
    },
  ];

  // Transform editor data to InvoiceView format for live preview
  const getPreviewData = () => {
    const previewItems: InvoiceItem[] = items
      .filter((item) => item.description.trim())
      .map((item) => ({
        id: item.id,
        invoice_id: "preview",
        user_id: "preview",
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
        created_at: new Date().toISOString().split("T")[0],
      }));

    const previewInvoice: Invoice & { invoice_items: InvoiceItem[] } = {
      id: "preview",
      user_id: "preview",
      invoice_number: invoice.invoice_number || previewInvoiceNumber,
      customer_name: invoice.customer_name || "Customer Name",
      customer_email: invoice.customer_email || null,
      customer_address: invoice.customer_address || null,
      issue_date: invoice.issue_date || previewDate,
      due_date: invoice.due_date || previewDate,
      status: invoice.status || "draft",
      subtotal: invoice.subtotal || 0,
      tax_rate: invoice.tax_rate || 0,
      tax_amount: invoice.tax_amount || 0,
      total_amount: invoice.total_amount || 0,
      notes: invoice.notes || null,
      created_at: previewDate,
      updated_at: previewDate,
      invoice_items: previewItems,
    };

    return previewInvoice;
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Editor Section */}
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Information */}
            <PrelineCard title="Customer Information" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PrelineInput
                  type="text"
                  label="Customer Name"
                  required
                  value={invoice.customer_name || ""}
                  onChange={(value) =>
                    setInvoice({ ...invoice, customer_name: value })
                  }
                />
                <PrelineInput
                  type="email"
                  label="Customer Email"
                  value={invoice.customer_email || ""}
                  onChange={(value) =>
                    setInvoice({ ...invoice, customer_email: value })
                  }
                />
                <div className="md:col-span-2">
                  <PrelineTextarea
                    label="Customer Address"
                    rows={3}
                    value={invoice.customer_address || ""}
                    onChange={(value) =>
                      setInvoice({ ...invoice, customer_address: value })
                    }
                  />
                </div>
              </div>
            </PrelineCard>

            {/* Invoice Details */}
            <PrelineCard title="Invoice Details" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <PrelineInput
                  type="text"
                  label="Invoice Number"
                  value={invoice.invoice_number || ""}
                  onChange={(value) =>
                    setInvoice({ ...invoice, invoice_number: value })
                  }
                />
                <PrelineDropdown
                  label="Status"
                  value={invoice.status || "draft"}
                  onChange={(value) =>
                    setInvoice({
                      ...invoice,
                      status: value as "draft" | "sent" | "paid" | "overdue",
                    })
                  }
                  options={statusOptions}
                />
                <PrelineInput
                  type="date"
                  label="Issue Date"
                  value={invoice.issue_date || ""}
                  onChange={(value) =>
                    setInvoice({ ...invoice, issue_date: value })
                  }
                />
                <PrelineInput
                  type="date"
                  label="Due Date"
                  value={invoice.due_date || ""}
                  onChange={(value) =>
                    setInvoice({ ...invoice, due_date: value })
                  }
                />
              </div>
            </PrelineCard>

            {/* Invoice Items */}
            <PrelineCard title="Invoice Items" className="p-6">
              <DataTable
                key={`items-table-${items.length}-${items
                  .map((i) => i.id)
                  .join("-")}`}
                data={items}
                columns={itemColumns}
                actions={itemActions}
                searchable={false}
                filterable={false}
                refreshable={false}
                paginated={false}
                emptyMessage="No items added yet. Add items using the form below."
                className="mb-6"
              />

              {/* Add Item Form */}
              <div className="border-t border-border-primary pt-6">
                <h4 className="text-md font-medium text-text-primary mb-4">
                  Add New Item
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <PrelineInput
                      type="text"
                      label="Description"
                      placeholder="Item description"
                      value={newItem.description}
                      onChange={(value) => updateNewItem("description", value)}
                      required
                    />
                  </div>
                  <div>
                    <PrelineInput
                      type="number"
                      label="Quantity"
                      min={0}
                      step={0.01}
                      value={newItem.quantity.toString()}
                      onChange={(value) =>
                        updateNewItem("quantity", parseFloat(value) || 0)
                      }
                      required
                    />
                  </div>
                  <div>
                    <PrelineInput
                      type="number"
                      label="Unit Price"
                      min={0}
                      step={0.01}
                      value={newItem.unit_price.toString()}
                      onChange={(value) =>
                        updateNewItem("unit_price", parseFloat(value) || 0)
                      }
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-text-secondary">
                    Line Total:{" "}
                    {formatCurrency(newItem.quantity * newItem.unit_price)}
                  </div>
                  <PrelineButton
                    type="button"
                    variant="primary"
                    onClick={addItem}
                    disabled={!newItem.description.trim()}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Add Item
                  </PrelineButton>
                </div>
              </div>
            </PrelineCard>

            {/* Totals */}
            <PrelineCard title="Totals" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <PrelineInput
                  type="number"
                  label="Tax Rate (%)"
                  min={0}
                  max={100}
                  step={0.01}
                  value={(invoice.tax_rate || 0).toString()}
                  onChange={(value) => {
                    const taxRate = parseFloat(value) || 0;
                    const subtotal = invoice.subtotal || 0;
                    const taxAmount = (subtotal * taxRate) / 100;
                    const total = subtotal + taxAmount;
                    setInvoice({
                      ...invoice,
                      tax_rate: taxRate,
                      tax_amount: taxAmount,
                      total_amount: total,
                    });
                  }}
                />
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Subtotal
                  </label>
                  <div className="block w-full px-3 py-2 border border-border-primary rounded-md bg-bg-tertiary text-sm">
                    {formatCurrency(invoice.subtotal || 0)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Tax Amount
                  </label>
                  <div className="block w-full px-3 py-2 border border-border-primary rounded-md bg-bg-tertiary text-sm">
                    {formatCurrency(invoice.tax_amount || 0)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Total Amount
                  </label>
                  <div className="block w-full px-3 py-2 border border-border-primary rounded-md bg-bg-tertiary text-sm font-semibold">
                    {formatCurrency(invoice.total_amount || 0)}
                  </div>
                </div>
              </div>
            </PrelineCard>

            {/* Notes */}
            <PrelineCard title="Notes" className="p-6">
              <PrelineTextarea
                rows={4}
                placeholder="Additional notes or terms..."
                value={invoice.notes || ""}
                onChange={(value) => setInvoice({ ...invoice, notes: value })}
              />
            </PrelineCard>
          </form>
        </div>

        {/* Preview Section */}
        <div className="hidden xl:block">
          <InvoiceView invoice={getPreviewData()} isPreview={true} />
        </div>
      </div>

      {/* Centered Submit Button */}
      <div className="flex justify-center mt-8">
        <PrelineButton
          type="button"
          disabled={loading}
          loading={loading}
          onClick={() =>
            handleSubmit({ preventDefault: () => {} } as React.FormEvent)
          }
          size="lg"
        >
          {loading ? "Saving..." : submitLabel}
        </PrelineButton>
      </div>
    </div>
  );
}
