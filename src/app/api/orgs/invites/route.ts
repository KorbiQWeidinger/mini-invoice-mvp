import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/server/supabase/createServerClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// POST /api/orgs/invites - create an invite
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organization_id, email, role } = body ?? {};
    const supabase = await createServerClient();
    const { data: user } = await supabase.auth.getUser();
    const invited_by = user?.user?.id ?? null;
    const { data, error } = await supabase
      .from("organization_invites")
      .insert({ organization_id, email, role, invited_by })
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json({ invite: data }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create invite" }, { status: 400 });
  }
}

