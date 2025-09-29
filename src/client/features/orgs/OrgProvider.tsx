"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface OrgContextValue {
  organizations: Organization[];
  currentOrgId: string | null;
  setCurrentOrgId: (orgId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const OrgContext = createContext<OrgContextValue | undefined>(undefined);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrgId, setCurrentOrgIdState] = useState<string | null>(null);

  const fetchOrganizations = useCallback(async () => {
    const res = await fetch("/api/orgs", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setOrganizations(data.organizations ?? []);
    }
  }, []);

  const fetchCurrent = useCallback(async () => {
    const res = await fetch("/api/orgs/current", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setCurrentOrgIdState(data.organizationId ?? null);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
    fetchCurrent();
  }, [fetchOrganizations, fetchCurrent]);

  const setCurrentOrgId = async (orgId: string) => {
    await fetch("/api/orgs/current", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: orgId }),
    });
    setCurrentOrgIdState(orgId);
  };

  const refresh = async () => {
    await Promise.all([fetchOrganizations(), fetchCurrent()]);
  };

  return (
    <OrgContext.Provider value={{ organizations, currentOrgId, setCurrentOrgId, refresh }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used within OrgProvider");
  return ctx;
}

