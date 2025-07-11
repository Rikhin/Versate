'use client';

export const dynamic = "force-dynamic";

import { MessageButton } from "@/components/messaging/MessageButton";

export default function MessagesPage() {
  // Minimal placeholder: show a message and a button to start a conversation with a test user
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">Your Messages</h1>
      <div className="flex flex-col gap-4">
        <MessageButton recipientId="test-user-id" recipientName="Test User" />
        {/* TODO: Replace with real conversation list and MessageDialog for selected conversation */}
      </div>
    </div>
  );
} 