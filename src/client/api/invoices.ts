import type { Invoice, InvoiceInsert, InvoiceUpdate, InvoiceItem } from "@/db/database";

// Client-side API service for invoices
export const invoiceApiService = {
  // Get all invoices
  async getAll(): Promise<Invoice[]> {
    const response = await fetch("/api/invoices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch invoices");
    }

    const data = await response.json();
    return data.invoices;
  },

  // Get invoice by ID
  async getById(id: string): Promise<Invoice & { invoice_items: InvoiceItem[] }> {
    const response = await fetch(`/api/invoices/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch invoice");
    }

    const data = await response.json();
    return data.invoice;
  },

  // Create new invoice
  async create(invoice: InvoiceInsert): Promise<Invoice> {
    const response = await fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoice),
    });

    if (!response.ok) {
      throw new Error("Failed to create invoice");
    }

    const data = await response.json();
    return data.invoice;
  },

  // Update invoice
  async update(id: string, updates: InvoiceUpdate): Promise<Invoice> {
    const response = await fetch(`/api/invoices/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update invoice");
    }

    const data = await response.json();
    return data.invoice;
  },

  // Delete invoice
  async delete(id: string): Promise<void> {
    const response = await fetch(`/api/invoices/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete invoice");
    }
  },

  // Search invoices
  async search(query: string): Promise<Invoice[]> {
    const response = await fetch(
      `/api/invoices?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to search invoices");
    }

    const data = await response.json();
    return data.invoices;
  },
};
