export interface OrganizationDTO {
  id: string;
  name: string;
  slug: string;
}

export const orgApi = {
  async list(): Promise<OrganizationDTO[]> {
    const res = await fetch("/api/orgs", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch organizations");
    const data = await res.json();
    return data.organizations ?? [];
  },
  async create(payload: {
    name: string;
    slug: string;
    billing_email?: string;
    address?: string;
    tax_id?: string;
  }): Promise<string> {
    const res = await fetch("/api/orgs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create organization");
    const data = await res.json();
    return data.organizationId as string;
  },
  async getCurrent(): Promise<string | null> {
    const res = await fetch("/api/orgs/current", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.organizationId ?? null;
  },
  async setCurrent(organizationId: string) {
    await fetch("/api/orgs/current", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId }),
    });
  },
  async invite(payload: { organization_id: string; email: string; role: 'owner'|'admin'|'member' }) {
    const res = await fetch("/api/orgs/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create invite");
    return (await res.json()).invite;
  },
  async acceptInvite(token: string) {
    const res = await fetch("/api/orgs/invites/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) throw new Error("Failed to accept invite");
    return (await res.json()).membershipId as string;
  },
};

