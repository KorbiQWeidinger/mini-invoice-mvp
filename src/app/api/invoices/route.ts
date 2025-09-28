import { NextRequest, NextResponse } from "next/server";
import { invoiceService } from "@/db/database";

// Disable caching for API routes
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/invoices - List all invoices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    let invoices;
    if (query) {
      invoices = await invoiceService.search(query);
    } else {
      invoices = await invoiceService.getAll();
    }

    // Add cache-busting headers
    const response = NextResponse.json({ invoices });
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");

    return response;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

// POST /api/invoices - Create new invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, ...invoiceData } = body;

    // Create invoice
    const invoice = await invoiceService.create(invoiceData);

    // Create invoice items if provided
    if (items && Array.isArray(items)) {
      const { invoiceItemService } = await import("@/db/database");
      for (const item of items) {
        await invoiceItemService.create({
          ...item,
          invoice_id: invoice.id,
        });
      }
    }

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
