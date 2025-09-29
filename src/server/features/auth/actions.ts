"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "@/server/supabase/createServerClient";

export async function signInWithGoogle() {
  const supabase = await createServerClient();

  // Get the site URL with better fallback logic
  const getSiteUrl = () => {
    // First try the environment variable
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return process.env.NEXT_PUBLIC_SITE_URL;
    }

    // Fallback to localhost for development
    return "https://mini-invoice-mvp.vercel.app";
  };

  const siteUrl = getSiteUrl();

  console.log(
    "NEXT_PUBLIC_SITE_URL",
    process.env.NEXT_PUBLIC_SITE_URL,
    "redirectTo",
    siteUrl
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    redirect("/error");
  }

  if (data.url) {
    redirect(data.url);
  }
}
