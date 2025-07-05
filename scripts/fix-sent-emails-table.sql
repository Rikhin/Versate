-- Check if sent_emails table exists and add missing columns
-- First, let's see what columns exist and add the missing ones

-- Add sender_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sent_emails' AND column_name = 'sender_id') THEN
        ALTER TABLE sent_emails ADD COLUMN sender_id TEXT;
    END IF;
END $$;

-- Add email_to column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sent_emails' AND column_name = 'email_to') THEN
        ALTER TABLE sent_emails ADD COLUMN email_to TEXT;
    END IF;
END $$;

-- Add body column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sent_emails' AND column_name = 'body') THEN
        ALTER TABLE sent_emails ADD COLUMN body TEXT;
    END IF;
END $$;

-- Add reply_to column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sent_emails' AND column_name = 'reply_to') THEN
        ALTER TABLE sent_emails ADD COLUMN reply_to TEXT;
    END IF;
END $$;

-- Add sent_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sent_emails' AND column_name = 'sent_at') THEN
        ALTER TABLE sent_emails ADD COLUMN sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add created_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sent_emails' AND column_name = 'created_at') THEN
        ALTER TABLE sent_emails ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_sent_emails_sender_id ON sent_emails(sender_id);
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