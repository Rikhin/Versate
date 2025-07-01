import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { partnerId } = await request.json();
    if (!partnerId) {
      return NextResponse.json({ error: "Missing partnerId" }, { status: 400 });
    }
    const supabase = createServerClient();
    // Mark all messages from partnerId to userId as read
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", partnerId)
      .eq("recipient_id", userId)
      .eq("is_read", false);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 