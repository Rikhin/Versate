import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { competitions } = body;

    if (!competitions || !Array.isArray(competitions)) {
      return NextResponse.json(
        { error: "Invalid competitions data" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // First, get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return NextResponse.json(
        { error: "Profile not found. Please complete onboarding first." },
        { status: 404 }
      );
    }

    // Update the profile with the new competitions data
    const { data, error } = await supabase
      .from("profiles")
      .update({
        competitions: competitions
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error updating competitions:", error);
      return NextResponse.json(
        { error: `Database error updating competitions: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Competition interests updated successfully",
      data 
    }, { status: 200 });

  } catch (error) {
    console.error("Competition interests update error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 