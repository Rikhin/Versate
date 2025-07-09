"use client";

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

// Simple test component to isolate the build issue
export default function SimpleAISearchPage() {
  const { userId } = useAuth();
  const [message, setMessage] = useState('Hello, world!');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">AI Search Test Page</h1>
      <p className="mb-4">This is a simplified test page to isolate the build issue.</p>
      <div className="bg-white p-4 rounded shadow">
        <p>{message}</p>
        {userId ? (
          <p className="text-green-600 mt-2">User is signed in</p>
        ) : (
          <p className="text-red-600 mt-2">User is not signed in</p>
        )}
      </div>
    </div>
  );
}
