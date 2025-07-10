import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();
    
    // Get all messages for the user
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      return NextResponse.json(
        { error: "Failed to fetch conversations" },
        { status: 500 }
      );
    }

    // Collect all unique partner user IDs
    const partnerIds = new Set();
    messages?.forEach((msg) => {
      if (msg.sender_id !== userId) partnerIds.add(msg.sender_id);
      if (msg.recipient_id !== userId) partnerIds.add(msg.recipient_id);
    });
    const partnerIdList = Array.from(partnerIds);

    // Fetch partner profiles
    let profilesMap: Record<string, unknown> = {};
    if (partnerIdList.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name, avatar_url")
        .in("user_id", partnerIdList);
      profilesMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p]));
    }

    // Group messages by conversation partner
    const conversationMap = new Map();
    messages?.forEach((message) => {
      const isSender = message.sender_id === userId;
      const partnerId = isSender ? message.recipient_id : message.sender_id;
      const partner = profilesMap[partnerId] || null;
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          partnerId,
          partner,
          lastMessage: message,
          unreadCount: 0,
        });
      }
      const conversation = conversationMap.get(partnerId);
      if (!message.is_read && !isSender) {
        conversation.unreadCount++;
      }
    });

    const conversationList = Array.from(conversationMap.values());
    return NextResponse.json(conversationList);
  } catch (error) {
    console.error("Conversations fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: senderId } = await auth();
    if (!senderId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { userId: recipientId } = await request.json();
    if (!recipientId) {
      return NextResponse.json({ error: "Recipient userId required" }, { status: 400 });
    }
    if (recipientId === senderId) {
      return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
    }
    // Optionally, check if the recipient exists in profiles
    const supabase = createServerClient();
    const { data: recipientProfile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("user_id", recipientId)
      .single();
    if (!recipientProfile) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }
    // Check if any messages exist between sender and recipient
    await supabase
      .from("messages")
      .select("id")
      .or(`and(sender_id.eq.${senderId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${senderId})`);
    // No need to create a message, just return the conversationId (partnerId)
    return NextResponse.json({ conversationId: recipientId });
  } catch (error) {
    console.error("Conversation start error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 