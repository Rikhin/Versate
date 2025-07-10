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
  } catch {
    return NextResponse.json({ error: 'Failed to fetch user email from Clerk' }, { status: 500 });
  }

  const payload: unknown = {
    from: 'Versate <info@versate.pro>', // Use your verified sender
    to,
    subject,
    text,
    reply_to: userEmail,
  };

  let resendSuccess = false;
  let resendError = null;
  let resendData = null;

  // Try to send email via Resend
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    resendData = await res.json();
    resendSuccess = res.ok;
    
    if (!res.ok) {
      resendError = resendData.error || 'Failed to send email';
      console.error('Resend API error:', resendData);
    }
  } catch {
    resendError = 'Network error when sending email';
    console.error('Resend network error');
  }

  // Always log to Supabase regardless of Resend success/failure
  let logError = null;
  let logData = null;
  
  try {
    const emailLogData = {
      sender_id: userId,
      email_to: to,
      subject,
      body: text,
      reply_to: userEmail,
      sent_at: new Date().toISOString(),
      // Add a status field to track if Resend succeeded
      status: resendSuccess ? 'sent' : 'failed',
      resend_error: resendError,
    };
    
    console.log('Email send API - Logging email to database:', emailLogData);
    
    const { error, data } = await supabase.from('sent_emails').insert([emailLogData]);

    console.log('Email send API - Database insert result:', { error, data });

    if (error) {
      logError = error;
      console.error('Supabase logging error:', error);
    } else {
      logData = data;
      console.log('Email send API - Successfully logged email to database');
    }
  } catch {
    logError = true;
    console.error('Supabase logging exception');
  }

  // Return appropriate response based on what happened
  if (resendSuccess) {
    if (logError) {
      // Email sent but logging failed
      return NextResponse.json({ 
        success: true, 
        data: resendData, 
        warning: 'Email sent but failed to log to database',
        logError 
      }, { status: 200 });
    } else {
      // Everything worked
      return NextResponse.json({ 
        success: true, 
        data: resendData, 
        log: logData 
      }, { status: 200 });
    }
  } else {
    if (logError) {
      // Both Resend and logging failed
      return NextResponse.json({ 
        error: resendError || 'Failed to send email',
        logError,
        resendResponse: resendData 
      }, { status: 500 });
    } else {
      // Resend failed but logging succeeded
      return NextResponse.json({ 
        error: resendError || 'Failed to send email',
        warning: 'Email logged but failed to send',
        resendResponse: resendData,
        log: logData 
      }, { status: 500 });
    }
  }
} 