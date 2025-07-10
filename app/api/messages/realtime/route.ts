import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

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
          } catch {
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