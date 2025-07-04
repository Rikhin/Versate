import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import * as Clerk from '@clerk/clerk-sdk-node';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { to, subject, text } = await req.json();
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  // Clerk Auth
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: 'Missing Resend API key' }, { status: 500 });
  }

  if (!to || !subject || !text) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Fetch user email from Clerk
  let userEmail = null;
  try {
    const user = await Clerk.users.getUser(userId);
    userEmail = user.emailAddresses[0]?.emailAddress || null;
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch user email from Clerk' }, { status: 500 });
  }

  const payload: any = {
    from: 'Versate <info@versate.pro>', // Use your verified sender
    to,
    subject,
    text,
    reply_to: userEmail,
  };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: data.error || 'Failed to send email', resendResponse: data, status: res.status }, { status: 500 });
  }

  // Log to Supabase
  const { error: logError, data: logData } = await supabase.from('sent_emails').insert([
    {
      sender_id: userId,
      to,
      subject,
      text,
      reply_to: userEmail,
      sent_at: new Date().toISOString(),
    },
  ]);

  if (logError) {
    return NextResponse.json({ success: true, data, logError }, { status: 200 });
  }

  return NextResponse.json({ success: true, data, log: logData });
} 