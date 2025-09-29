import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/server/supabase/createServerClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body ?? {};
    const supabase = await createServerClient();
    const { data, error } = await supabase.rpc("accept_organization_invite", { p_token: token });
    if (error) throw error;
    return NextResponse.json({ membershipId: data });
  } catch (e) {
    return NextResponse.json({ error: "Failed to accept invite" }, { status: 400 });
  }
}

