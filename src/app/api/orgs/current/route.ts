import { NextRequest, NextResponse } from "next/server";
import { getCurrentOrgIdFromRequest, setCurrentOrgIdCookie } from "@/server/orgs/current-org";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const organizationId = await getCurrentOrgIdFromRequest(request);
  return NextResponse.json({ organizationId });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const organizationId = body?.organizationId ?? null;
    await setCurrentOrgIdCookie(organizationId);
    return NextResponse.json({ organizationId });
  } catch (e) {
    return NextResponse.json({ error: "Failed to set current organization" }, { status: 400 });
  }
}

