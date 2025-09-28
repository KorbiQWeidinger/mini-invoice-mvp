import { NextRequest, NextResponse } from "next/server";
import { invoiceService } from "@/db/database";

// GET /api/invoices/[id] - Get single invoice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await invoiceService.getById(id);
    return NextResponse.json({ invoice });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
}

// PUT /api/invoices/[id] - Update invoice
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { items, ...invoiceData } = body;

    // Update invoice
    const invoice = await invoiceService.update(id, invoiceData);

    // Handle invoice items if provided
    if (items && Array.isArray(items)) {
      const { invoiceItemService } = await import("@/db/database");

      // Get existing items
      const existingItems = await invoiceItemService.getByInvoiceId(id);

      // Delete existing items
      for (const item of existingItems) {
        await invoiceItemService.delete(item.id);
      }

      // Create new items
      for (const item of items) {
        await invoiceItemService.create({
          ...item,
          invoice_id: id,
        });
      }
    }

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}

// DELETE /api/invoices/[id] - Delete invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await invoiceService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}
