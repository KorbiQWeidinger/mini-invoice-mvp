import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Environment check
    const envCheck = {
      supabaseUrl: supabaseUrl ? "✅ Set" : "❌ Missing",
      supabaseAnonKey: supabaseAnonKey ? "✅ Set" : "❌ Missing",
      supabaseUrlValue: supabaseUrl || "Not set",
      supabaseAnonKeyValue: supabaseAnonKey
        ? `${supabaseAnonKey.substring(0, 20)}...`
        : "Not set",
    };

    // Test Supabase connection
    let connectionTest = null;
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const { data, error } = await supabase
          .from("invoices")
          .select("id, invoice_number, created_at")
          .limit(5);

        if (error) {
          connectionTest = {
            status: "❌ Error",
            error: error.message,
            code: error.code,
          };
        } else {
          connectionTest = {
            status: "✅ Connected",
            invoiceCount: data?.length || 0,
            sampleInvoices:
              data?.map((inv) => ({
                id: inv.id,
                invoice_number: inv.invoice_number,
                created_at: inv.created_at,
              })) || [],
          };
        }
      } catch (connectionError) {
        connectionTest = {
          status: "❌ Connection Failed",
          error:
            connectionError instanceof Error
              ? connectionError.message
              : "Unknown error",
        };
      }
    } else {
      connectionTest = {
        status: "❌ Cannot test - missing environment variables",
      };
    }

    return NextResponse.json({
      message: "Supabase connection debug",
      environment: envCheck,
      connection: connectionTest,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to debug Supabase connection",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
