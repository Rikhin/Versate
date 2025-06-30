import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      school = "",
      gradeLevel = "",
      bio = "",
      skills = [],
      roles = [],
      experienceLevel = "Beginner",
      timeCommitment = "Flexible",
      collaborationStyle = [],
      location = "",
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 409 }
      );
    }

    // Create new profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .insert({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        email,
        school,
        grade_level: gradeLevel,
        bio,
        skills,
        roles,
        experience_level: experienceLevel,
        time_commitment: timeCommitment,
        collaboration_style: collaborationStyle,
        location,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating profile:", error);
      return NextResponse.json(
        { error: "Failed to create profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 