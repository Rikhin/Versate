import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      first_name,
      last_name,
      email,
      school,
      grade_level,
      bio,
      skills,
      roles,
      experience_level,
      time_commitment,
      collaboration_style,
      location,
    } = body;

    // Validate required fields
    if (!user_id || !first_name || !last_name || !email) {
      return NextResponse.json(
        { error: `Missing required fields. Received: user_id=${!!user_id}, first_name=${!!first_name}, last_name=${!!last_name}, email=${!!email}` },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user_id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing profile:", checkError);
      return NextResponse.json(
        { error: `Database error checking profile: ${checkError.message}` },
        { status: 500 }
      );
    }

    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 409 }
      );
    }

    // Create new profile
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        user_id,
        first_name,
        last_name,
        email,
        school,
        grade_level,
        bio,
        skills: skills || [],
        roles: roles || [],
        experience_level,
        time_commitment,
        collaboration_style: collaboration_style || [],
        location,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating profile:", error);
      return NextResponse.json(
        { error: `Database error creating profile: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // For now, just return a success response to test the flow
    return NextResponse.json({ message: "API working" });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 