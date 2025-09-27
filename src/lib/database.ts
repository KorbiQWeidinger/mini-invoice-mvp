import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabase-admin";
import type { Database } from "./supabase";

// Type aliases for easier usage
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type InvoiceInsert = Database["public"]["Tables"]["invoices"]["Insert"];
export type InvoiceUpdate = Database["public"]["Tables"]["invoices"]["Update"];

export type InvoiceItem = Database["public"]["Tables"]["invoice_items"]["Row"];
export type InvoiceItemInsert =
  Database["public"]["Tables"]["invoice_items"]["Insert"];
export type InvoiceItemUpdate =
  Database["public"]["Tables"]["invoice_items"]["Update"];

// Invoice operations
export const invoiceService = {
  // Get all invoices
  async getAll() {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get invoice by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from("invoices")
      .select(
        `
        *,
        invoice_items (*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new invoice
  async create(invoice: InvoiceInsert) {
    const { data, error } = await supabase
      .from("invoices")
      .insert(invoice)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update invoice
  async update(id: string, updates: InvoiceUpdate) {
    const { data, error } = await supabase
      .from("invoices")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete invoice
  async delete(id: string) {
    const { error } = await supabase.from("invoices").delete().eq("id", id);

    if (error) throw error;
  },

  // Search invoices
  async search(query: string) {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .or(
        `invoice_number.ilike.%${query}%,customer_name.ilike.%${query}%,customer_email.ilike.%${query}%`
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};

// Invoice items operations
export const invoiceItemService = {
  // Get items for an invoice
  async getByInvoiceId(invoiceId: string) {
    const { data, error } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Add item to invoice
  async create(item: InvoiceItemInsert) {
    const { data, error } = await supabase
      .from("invoice_items")
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update item
  async update(id: string, updates: InvoiceItemUpdate) {
    const { data, error } = await supabase
      .from("invoice_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete item
  async delete(id: string) {
    const { error } = await supabase
      .from("invoice_items")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
