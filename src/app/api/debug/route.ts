import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Check if environment variables are set
    const envCheck = {
      supabaseUrl: supabaseUrl ? "✅ Set" : "❌ Missing",
      supabaseAnonKey: supabaseAnonKey ? "✅ Set" : "❌ Missing",
      supabaseUrlValue: supabaseUrl || "Not set",
      supabaseAnonKeyValue: supabaseAnonKey
        ? `${supabaseAnonKey.substring(0, 20)}...`
        : "Not set",
    };

    return NextResponse.json({
      message: "Environment variables check",
      environment: envCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to check environment variables",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
