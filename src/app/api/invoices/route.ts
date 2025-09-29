import { NextRequest, NextResponse } from "next/server";
import { invoiceService } from "@/db/database";
import { getCurrentOrgIdFromRequest } from "@/server/orgs/current-org";

// Disable caching for API routes
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/invoices - List all invoices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const organizationId = await getCurrentOrgIdFromRequest(request);

    let invoices;
    if (query) {
      invoices = await invoiceService.search(query, { organizationId });
    } else {
      invoices = await invoiceService.getAll({ organizationId });
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
    const organizationId = await getCurrentOrgIdFromRequest(request);

    const payload = { ...invoiceData, organization_id: organizationId } as any;

    // Create invoice
    const invoice = await invoiceService.create(payload);

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
