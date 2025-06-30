import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();
    
    // Get all conversations for the user
    const { data: conversations, error } = await supabase
      .from("messages")
      .select(`
        id,
        sender_id,
        recipient_id,
        content,
        created_at,
        is_read,
        sender:profiles!messages_sender_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url
        ),
        recipient:profiles!messages_recipient_id_fkey(
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      return NextResponse.json(
        { error: "Failed to fetch conversations" },
        { status: 500 }
      );
    }

    // Group messages by conversation partner
    const conversationMap = new Map();
    
    conversations?.forEach((message) => {
      const isSender = message.sender_id === userId;
      const partnerId = isSender ? message.recipient_id : message.sender_id;
      const partner = isSender ? message.recipient : message.sender;
      
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