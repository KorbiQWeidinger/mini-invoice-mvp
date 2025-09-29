import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/server/supabase/createServerClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("organizations")
      .select("id,name,slug")
      .order("name", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ organizations: data ?? [] });
  } catch (e) {
    return NextResponse.json({ error: "Failed to load organizations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, billing_email, address, tax_id } = body ?? {};
    const supabase = await createServerClient();
    const { data, error } = await supabase.rpc("create_organization", {
      p_name: name,
      p_slug: slug,
      p_billing_email: billing_email ?? null,
      p_address: address ?? null,
      p_tax_id: tax_id ?? null,
    });
    if (error) throw error;
    return NextResponse.json({ organizationId: data }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 });
  }
}

