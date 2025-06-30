import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    const supabase = createServerClient();
    
    let queryBuilder = supabase
      .from("profiles")
      .select("*")
      .neq("user_id", userId); // Exclude current user

    if (query.trim()) {
      // Search by name, skills, or bio
      queryBuilder = queryBuilder.or(
        `first_name.ilike.%${query}%,last_name.ilike.%${query}%,skills.cs.{${query}},bio.ilike.%${query}%`
      );
    }

    const { data: profiles, error } = await queryBuilder
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error searching profiles:", error);
      return NextResponse.json(
        { error: "Failed to search profiles" },
        { status: 500 }
      );
    }

    return NextResponse.json(profiles || []);
  } catch (error) {
    console.error("Profile search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 