-- Create sent_emails table if it doesn't exist
CREATE TABLE IF NOT EXISTS sent_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id TEXT NOT NULL,
  email_to TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  reply_to TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by sender_id
CREATE INDEX IF NOT EXISTS idx_sent_emails_sender_id ON sent_emails(sender_id);

-- Create index for faster queries by sent_at
CREATE INDEX IF NOT EXISTS idx_sent_emails_sent_at ON sent_emails(sent_at);

-- Enable RLS
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own sent emails" ON sent_emails;
DROP POLICY IF EXISTS "Users can insert their own sent emails" ON sent_emails;

-- Create RLS policy to allow users to see only their own sent emails
CREATE POLICY "Users can view their own sent emails" ON sent_emails
  FOR SELECT USING (sender_id = auth.uid()::text);

-- Create RLS policy to allow users to insert their own sent emails
CREATE POLICY "Users can insert their own sent emails" ON sent_emails
  FOR INSERT WITH CHECK (sender_id = auth.uid()::text); 