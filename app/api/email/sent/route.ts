import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // Clerk Auth
    const { userId } = getAuth(req);
    console.log('Sent emails API - User ID:', userId);
    
    if (!userId) {
      console.log('Sent emails API - No user ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Log the query we're about to execute
    console.log('Sent emails API - Querying for sender_id:', userId);
    
    // Fetch sent emails for this user
    const { data: emails, error } = await supabase
      .from('sent_emails')
      .select('*')
      .eq('sender_id', userId)
      .order('sent_at', { ascending: false });

    console.log('Sent emails API - Query result:', { emails, error });

    if (error) {
      console.error('Error fetching sent emails:', error);
      return NextResponse.json({ error: 'Failed to fetch sent emails' }, { status: 500 });
    }

    console.log('Sent emails API - Returning emails count:', emails?.length || 0);
    return NextResponse.json({ emails: emails || [] });
  } catch (error) {
    console.error('Sent emails fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 