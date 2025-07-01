import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipientId, content } = await request.json();
    
    if (!recipientId || !content) {
      return NextResponse.json(
        { error: "Recipient ID and content are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    
    // Insert the message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        sender_id: userId,
        recipient_id: recipientId,
        content: content.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      return NextResponse.json(
        { error: error.message || error.details || JSON.stringify(error) },
        { status: 500 }
      );
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Message send error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationWith = searchParams.get("with");
    
    if (!conversationWith) {
      return NextResponse.json(
        { error: "Conversation partner ID is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    
    // Get messages between the two users
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${userId},recipient_id.eq.${conversationWith}),and(sender_id.eq.${conversationWith},recipient_id.eq.${userId})`)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Message fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 