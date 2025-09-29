import { cookies } from "next/headers";

const ORG_COOKIE = "current_org_id";

export async function getCurrentOrgIdFromRequest(_req: unknown) {
  try {
    const jar = cookies();
    const cookie = jar.get(ORG_COOKIE);
    return cookie?.value ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentOrgIdFromCookies() {
  const jar = cookies();
  const cookie = jar.get(ORG_COOKIE);
  return cookie?.value ?? null;
}

export async function setCurrentOrgIdCookie(orgId: string | null) {
  const jar = cookies();
  if (orgId) {
    jar.set(ORG_COOKIE, orgId, {
      path: "/",
      sameSite: "lax",
    });
  } else {
    jar.delete(ORG_COOKIE);
  }
}

