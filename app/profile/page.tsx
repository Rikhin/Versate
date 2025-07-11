'use client';

export const dynamic = "force-dynamic";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user } = useUser();
  if (!user) return <div className="min-h-screen flex items-center justify-center text-gray-500">Not signed in.</div>;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full p-8 bg-white/80 border border-gray-200 rounded-2xl shadow-xl">
        <CardContent className="flex flex-col items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
            <AvatarFallback>{user.fullName?.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{user.fullName}</h2>
            <div className="text-gray-500 text-sm mb-2">{user.primaryEmailAddress?.emailAddress}</div>
            <Button variant="outline" size="sm" className="mt-2">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 