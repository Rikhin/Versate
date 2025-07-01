import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

// Store active connections
const connections = new Map<string, ReadableStreamDefaultController>();

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Set up SSE headers
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Store the controller for this user
        connections.set(userId, controller);
        
        // Send initial connection message
        const message = `data: ${JSON.stringify({ type: 'connected', userId })}\n\n`;
        controller.enqueue(encoder.encode(message));
        
        // Keep connection alive with heartbeat
        const heartbeat = setInterval(() => {
          try {
            const heartbeatMsg = `data: ${JSON.stringify({ type: 'heartbeat' })}\n\n`;
            controller.enqueue(encoder.encode(heartbeatMsg));
          } catch (error) {
            clearInterval(heartbeat);
            connections.delete(userId);
          }
        }, 30000); // Send heartbeat every 30 seconds

        // Clean up on disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeat);
          connections.delete(userId);
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });
  } catch (error) {
    console.error("SSE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Function to broadcast messages to connected clients
export function broadcastMessage(userId: string, message: any) {
  console.log(`Broadcasting message to user ${userId}:`, message);
  const controller = connections.get(userId);
  if (controller) {
    try {
      const encoder = new TextEncoder();
      const messageStr = `data: ${JSON.stringify({ type: 'new_message', message })}\n\n`;
      console.log('Sending message string:', messageStr);
      controller.enqueue(encoder.encode(messageStr));
      console.log('Message broadcasted successfully');
    } catch (error) {
      console.error("Error broadcasting message:", error);
      connections.delete(userId);
    }
  } else {
    console.log(`No active connection found for user ${userId}`);
  }
}

// Function to broadcast conversation updates
export function broadcastConversationUpdate(userId: string) {
  const controller = connections.get(userId);
  if (controller) {
    try {
      const encoder = new TextEncoder();
      const messageStr = `data: ${JSON.stringify({ type: 'conversation_update' })}\n\n`;
      controller.enqueue(encoder.encode(messageStr));
    } catch (error) {
      console.error("Error broadcasting conversation update:", error);
      connections.delete(userId);
    }
  }
} 