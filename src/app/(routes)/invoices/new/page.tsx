"use client";

import { useState } from "react";
import {
  invoiceService,
  invoiceItemService,
  type InvoiceInsert,
  type InvoiceItemInsert,
} from "@/db/database";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import PageHeader from "@/client/common/components/PageHeader";
import { PrelineInput } from "@/client/common/components/ui/PrelineInput";
import { PrelineButton } from "@/client/common/components/ui/PrelineButton";
import { PrelineTextarea } from "@/client/common/components/ui/PrelineTextarea";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      unit_price: 0,
      line_total: 0,
    },
  ]);

  const calculateTotals = (items: InvoiceItem[]) => {
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
    field: keyof InvoiceItem,
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
    const newItem: InvoiceItem = {
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
    setLoading(true);

    try {
      // Create invoice
      const invoiceData: InvoiceInsert = {
        invoice_number: invoice.invoice_number || `INV-${Date.now()}`,
        customer_name: invoice.customer_name || "",
        customer_email: invoice.customer_email || null,
        customer_address: invoice.customer_address || null,
        issue_date:
          invoice.issue_date || new Date().toISOString().split("T")[0],
        due_date: invoice.due_date || new Date().toISOString().split("T")[0],
        status: invoice.status || "draft",
        subtotal: invoice.subtotal || 0,
        tax_rate: invoice.tax_rate || 0,
        tax_amount: invoice.tax_amount || 0,
        total_amount: invoice.total_amount || 0,
        notes: invoice.notes || null,
      };

      const createdInvoice = await invoiceService.create(invoiceData);

      // Create invoice items
      for (const item of items) {
        if (item.description.trim()) {
          const itemData: InvoiceItemInsert = {
            invoice_id: createdInvoice.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            line_total: item.line_total,
          };
          await invoiceItemService.create(itemData);
        }
      }

      router.push("/invoices");
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <PageHeader
        title="Create Invoice"
        subtitle="Create a new invoice for your customer"
        actions={
          <PrelineButton variant="secondary" href="/invoices">
            Cancel
          </PrelineButton>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Information */}
        <div className="bg-bg-primary shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PrelineInput
                type="text"
                label="Customer Name"
                required
                value={invoice.customer_name || ""}
                onChange={(value) =>
                  setInvoice({
                    ...invoice,
                    customer_name: value,
                  })
                }
              />
              <PrelineInput
                type="email"
                label="Customer Email"
                value={invoice.customer_email || ""}
                onChange={(value) =>
                  setInvoice({
                    ...invoice,
                    customer_email: value,
                  })
                }
              />
              <div className="md:col-span-2">
                <PrelineTextarea
                  label="Customer Address"
                  rows={3}
                  value={invoice.customer_address || ""}
                  onChange={(value) =>
                    setInvoice({
                      ...invoice,
                      customer_address: value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-bg-primary shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">
              Invoice Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PrelineInput
                type="text"
                label="Invoice Number"
                value={invoice.invoice_number || ""}
                onChange={(value) =>
                  setInvoice({
                    ...invoice,
                    invoice_number: value,
                  })
                }
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
          </div>
        </div>

        {/* Invoice Items */}
        <div className="bg-bg-primary shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-text-primary">
                Invoice Items
              </h3>
              <PrelineButton
                type="button"
                onClick={addItem}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Item
              </PrelineButton>
            </div>

            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-border-primary">
                <thead className="bg-bg-tertiary">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Line Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-bg-primary divide-y divide-border-primary">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PrelineInput
                          type="number"
                          min={0}
                          step={0.01}
                          value={item.quantity.toString()}
                          onChange={(value) =>
                            updateItem(
                              item.id,
                              "quantity",
                              parseFloat(value) || 0
                            )
                          }
                          className="mb-0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        ${item.line_total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-error hover:text-error-text"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-bg-primary shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">
              Totals
            </h3>
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
                  ${(invoice.subtotal || 0).toFixed(2)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Tax Amount
                </label>
                <div className="block w-full px-3 py-2 border border-border-primary rounded-md bg-bg-tertiary text-sm">
                  ${(invoice.tax_amount || 0).toFixed(2)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Total Amount
                </label>
                <div className="block w-full px-3 py-2 border border-border-primary rounded-md bg-bg-tertiary text-sm font-semibold">
                  ${(invoice.total_amount || 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-bg-primary shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">
              Notes
            </h3>
            <PrelineTextarea
              rows={4}
              placeholder="Additional notes or terms..."
              value={invoice.notes || ""}
              onChange={(value) => setInvoice({ ...invoice, notes: value })}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <PrelineButton type="submit" disabled={loading} loading={loading}>
            {loading ? "Creating..." : "Create Invoice"}
          </PrelineButton>
        </div>
      </form>
    </div>
  );
}
