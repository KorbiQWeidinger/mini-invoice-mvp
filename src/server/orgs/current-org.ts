import { NextRequest, cookies } from "next/headers";

const ORG_COOKIE = "current_org_id";

export async function getCurrentOrgIdFromRequest(_req: NextRequest) {
  try {
    const jar = await cookies();
    const cookie = jar.get(ORG_COOKIE);
    return cookie?.value ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentOrgIdFromCookies() {
  const jar = await cookies();
  const cookie = jar.get(ORG_COOKIE);
  return cookie?.value ?? null;
}

export async function setCurrentOrgIdCookie(orgId: string | null) {
  const jar = await cookies();
  if (orgId) {
    jar.set(ORG_COOKIE, orgId, {
      path: "/",
      sameSite: "lax",
    });
  } else {
    jar.delete(ORG_COOKIE);
  }
}

