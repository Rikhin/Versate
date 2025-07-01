import { useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

interface RealtimeMessage {
  type: 'connected' | 'heartbeat' | 'new_message' | 'conversation_update';
  userId?: string;
  message?: any;
}

export function useRealtimeMessages(
  onNewMessage?: (message: any) => void,
  onConversationUpdate?: () => void
) {
  const { user } = useUser();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!user) return;

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    console.log('Connecting to real-time messaging...');

    // Create new EventSource connection
    const eventSource = new EventSource('/api/messages/realtime');
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('Real-time connection established');
    };

    eventSource.onmessage = (event) => {
      try {
        const data: RealtimeMessage = JSON.parse(event.data);
        console.log('Real-time message received:', data);

        switch (data.type) {
          case 'connected':
            console.log('Connected to real-time messaging');
            break;
          case 'heartbeat':
            // Keep connection alive
            break;
          case 'new_message':
            if (data.message && onNewMessage) {
              onNewMessage(data.message);
            }
            break;
          case 'conversation_update':
            if (onConversationUpdate) {
              onConversationUpdate();
            }
            break;
        }
      } catch (error) {
        console.error('Error parsing real-time message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Real-time connection error:', error);
      eventSource.close();
      
      // Attempt to reconnect after 5 seconds
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('Attempting to reconnect...');
        connect();
      }, 5000);
    };

    return eventSource;
  }, [user, onNewMessage, onConversationUpdate]);

  useEffect(() => {
    if (user) {
      connect();
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user, connect]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  return { disconnect };
} 