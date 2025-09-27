"use client";

import { useState } from "react";
import Link from "next/link";
import {
  invoiceService,
  invoiceItemService,
  type InvoiceInsert,
  type InvoiceItemInsert,
} from "@/lib/database";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <header className="bg-bg-primary shadow-sm border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-text-primary">
                Mini-Invoice MVP
              </h1>
            </div>
            <nav className="flex space-x-8">
              <Link
                href="/dashboard"
                className="text-text-secondary hover:text-brand-primary px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/invoices"
                className="text-text-primary hover:text-brand-primary px-3 py-2 text-sm font-medium"
              >
                Invoices
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-text-primary sm:text-3xl sm:truncate">
                Create Invoice
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Create a new invoice for your customer
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link
                href="/invoices"
                className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-border-primary text-text-secondary bg-bg-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                Cancel
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Information */}
            <div className="bg-bg-primary shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-text-primary mb-4">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={invoice.customer_name || ""}
                      onChange={(e) =>
                        setInvoice({
                          ...invoice,
                          customer_name: e.target.value,
                        })
                      }
                      className="py-2 px-4 block w-full border border-border-primary rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Customer Email
                    </label>
                    <input
                      type="email"
                      value={invoice.customer_email || ""}
                      onChange={(e) =>
                        setInvoice({
                          ...invoice,
                          customer_email: e.target.value,
                        })
                      }
                      className="py-2 px-4 block w-full border border-border-primary rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Customer Address
                    </label>
                    <textarea
                      rows={3}
                      value={invoice.customer_address || ""}
                      onChange={(e) =>
                        setInvoice({
                          ...invoice,
                          customer_address: e.target.value,
                        })
                      }
                      className="py-2 px-4 block w-full border border-border-primary rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary"
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
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      value={invoice.invoice_number || ""}
                      onChange={(e) =>
                        setInvoice({
                          ...invoice,
                          invoice_number: e.target.value,
                        })
                      }
                      className="py-2 px-4 block w-full border border-border-primary rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      value={invoice.issue_date || ""}
                      onChange={(e) =>
                        setInvoice({ ...invoice, issue_date: e.target.value })
                      }
                      className="py-2 px-4 block w-full border border-border-primary rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={invoice.due_date || ""}
                      onChange={(e) =>
                        setInvoice({ ...invoice, due_date: e.target.value })
                      }
                      className="py-2 px-4 block w-full border border-border-primary rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary"
                    />
                  </div>
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
                  <button
                    type="button"
                    onClick={addItem}
                    className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brand-primary text-white hover:bg-brand-primary-hover disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </button>
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
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="py-2 px-4 block w-full border border-border-primary rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary"
                              placeholder="Item description"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "quantity",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="py-2 px-4 block w-full border border-border-primary rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unit_price}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "unit_price",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="py-2 px-4 block w-full border border-border-primary rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary"
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
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={invoice.tax_rate || 0}
                      onChange={(e) => {
                        const taxRate = parseFloat(e.target.value) || 0;
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
                      className="py-2 px-4 block w-full border border-border-primary rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary"
                    />
                  </div>
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
                <textarea
                  rows={4}
                  value={invoice.notes || ""}
                  onChange={(e) =>
                    setInvoice({ ...invoice, notes: e.target.value })
                  }
                  className="py-2 px-4 block w-full border border-border-primary rounded-lg text-sm focus:border-brand-primary focus:ring-brand-primary disabled:opacity-50 disabled:pointer-events-none bg-bg-primary text-text-primary"
                  placeholder="Additional notes or terms..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brand-primary text-white hover:bg-brand-primary-hover disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Creating...
                  </>
                ) : (
                  "Create Invoice"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
