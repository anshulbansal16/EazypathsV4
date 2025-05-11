import { NextResponse } from "next/server"
import { verifySupabaseConnection } from "@/lib/verify-supabase"

export async function GET() {
  try {
    // Check if required environment variables are present
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing Supabase configuration",
          details: {
            hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    // Attempt to verify Supabase connection
    const connectionStatus = await verifySupabaseConnection()

    // If connection failed, return error response
    if (!connectionStatus.connected) {
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to connect to Supabase",
          details: connectionStatus,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      )
    }

    // Return success response
    return NextResponse.json(
      {
        status: "success",
        message: "Successfully connected to Supabase",
        details: connectionStatus,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Supabase verification failed:', error)
    return NextResponse.json(
      {
        status: "error",
        message: "Supabase verification failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
