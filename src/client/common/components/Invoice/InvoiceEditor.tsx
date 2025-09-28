"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  type InvoiceInsert,
  type InvoiceItemInsert,
  type InvoiceItem,
} from "@/db/database";
import { PrelineInput } from "@/client/common/components/ui/PrelineInput";
import { PrelineButton } from "@/client/common/components/ui/PrelineButton";
import { PrelineTextarea } from "@/client/common/components/ui/PrelineTextarea";
import { PrelineCard } from "@/client/common/components/ui/PrelineCard";

interface InvoiceEditorProps {
  initialInvoice?: Partial<InvoiceInsert>;
  initialItems?: InvoiceItem[];
  onSubmit: (
    invoice: InvoiceInsert,
    items: InvoiceItemInsert[]
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
}

interface InvoiceItemForm {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export function InvoiceEditor({
  initialInvoice,
  initialItems = [],
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = "Create Invoice",
}: InvoiceEditorProps) {
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

  const [items, setItems] = useState<InvoiceItemForm[]>(
    initialItems.length > 0
      ? initialItems.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: item.line_total,
        }))
      : [
          {
            id: "1",
            description: "",
            quantity: 1,
            unit_price: 0,
            line_total: 0,
          },
        ]
  );

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

  const updateItem = (
    id: string,
    field: keyof InvoiceItemForm,
    value: string | number
  ) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === "quantity" || field === "unit_price") {
          updatedItem.line_total =
            updatedItem.quantity * updatedItem.unit_price;
        }
        return updatedItem;
      }
      return item;
    });
    setItems(newItems);
    calculateTotals(newItems);
  };

  const addItem = () => {
    const newItem: InvoiceItemForm = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unit_price: 0,
      line_total: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      const newItems = items.filter((item) => item.id !== id);
      setItems(newItems);
      calculateTotals(newItems);
    }
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

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PrelineInput
            type="text"
            label="Invoice Number"
            value={invoice.invoice_number || ""}
            onChange={(value) =>
              setInvoice({ ...invoice, invoice_number: value })
            }
          />
          <PrelineInput
            type="date"
            label="Issue Date"
            value={invoice.issue_date || ""}
            onChange={(value) => setInvoice({ ...invoice, issue_date: value })}
          />
          <PrelineInput
            type="date"
            label="Due Date"
            value={invoice.due_date || ""}
            onChange={(value) => setInvoice({ ...invoice, due_date: value })}
          />
        </div>
      </PrelineCard>

      {/* Invoice Items */}
      <PrelineCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-text-primary">
            Invoice Items
          </h3>
          <PrelineButton
            type="button"
            variant="secondary"
            onClick={addItem}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Item
          </PrelineButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-tertiary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Line Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-bg-primary divide-y divide-border-primary">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <PrelineInput
                      type="text"
                      placeholder="Item description"
                      value={item.description}
                      onChange={(value) =>
                        updateItem(item.id, "description", value)
                      }
                      className="mb-0"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <PrelineInput
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.quantity.toString()}
                      onChange={(value) =>
                        updateItem(item.id, "quantity", parseFloat(value) || 0)
                      }
                      className="mb-0"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <PrelineInput
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.unit_price.toString()}
                      onChange={(value) =>
                        updateItem(
                          item.id,
                          "unit_price",
                          parseFloat(value) || 0
                        )
                      }
                      className="mb-0"
                    />
                  </td>
                  <td className="px-6 py-4 text-right text-text-secondary font-medium">
                    {formatCurrency(item.line_total)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {items.length > 1 && (
                      <PrelineButton
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        icon={<Trash2 className="w-4 h-4" />}
                      >
                        Remove
                      </PrelineButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3">
        <PrelineButton type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </PrelineButton>
        <PrelineButton type="submit" disabled={loading} loading={loading}>
          {loading ? "Saving..." : submitLabel}
        </PrelineButton>
      </div>
    </form>
  );
}
