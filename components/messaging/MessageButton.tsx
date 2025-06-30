"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { MessageDialog } from "./MessageDialog"

interface MessageButtonProps {
  recipientId: string
  recipientName: string
  className?: string
}

export function MessageButton({ recipientId, recipientName, className }: MessageButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Message
      </Button>
      
      <MessageDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        recipientId={recipientId}
        recipientName={recipientName}
      />
    </>
  )
} 