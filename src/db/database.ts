import { createServerClient } from "@/server/supabase/createServerClient";
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
  // Get all invoices for the authenticated user
  async getAll(params?: { organizationId?: string }) {
    const supabase = await createServerClient();
    let query = supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false })
      .abortSignal(AbortSignal.timeout(10000));

    if (params?.organizationId) {
      query = query.eq("organization_id", params.organizationId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  // Get invoice by ID for the authenticated user
  async getById(id: string) {
    const supabase = await createServerClient();
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

  // Create new invoice for the authenticated user
  async create(invoice: InvoiceInsert) {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("invoices")
      .insert(invoice)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update invoice for the authenticated user
  async update(id: string, updates: InvoiceUpdate) {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("invoices")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete invoice for the authenticated user
  async delete(id: string) {
    const supabase = await createServerClient();
    const { error } = await supabase.from("invoices").delete().eq("id", id);

    if (error) throw error;
  },

  // Search invoices for the authenticated user
  async search(query: string, params?: { organizationId?: string }) {
    const supabase = await createServerClient();
    let q = supabase
      .from("invoices")
      .select("*")
      .or(
        `invoice_number.ilike.%${query}%,customer_name.ilike.%${query}%,customer_email.ilike.%${query}%`
      )
      .order("created_at", { ascending: false });

    if (params?.organizationId) {
      q = q.eq("organization_id", params.organizationId);
    }

    const { data, error } = await q;

    if (error) throw error;
    return data;
  },
};

// Invoice items operations
export const invoiceItemService = {
  // Get items for an invoice for the authenticated user
  async getByInvoiceId(invoiceId: string) {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Add item to invoice for the authenticated user
  async create(item: InvoiceItemInsert) {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("invoice_items")
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update item for the authenticated user
  async update(id: string, updates: InvoiceItemUpdate) {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("invoice_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete item for the authenticated user
  async delete(id: string) {
    const supabase = await createServerClient();
    const { error } = await supabase
      .from("invoice_items")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
