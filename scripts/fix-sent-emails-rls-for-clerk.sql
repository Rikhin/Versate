-- Fix RLS policies for sent_emails table to work with Clerk authentication
-- Since we're using Clerk for auth and service role key in API routes, we'll disable RLS
-- The API routes handle authentication and filtering by sender_id

-- Disable RLS for sent_emails table since we handle auth in the API layer
ALTER TABLE sent_emails DISABLE ROW LEVEL SECURITY;

-- Drop existing policies since we're not using RLS
DROP POLICY IF EXISTS "Users can view their own sent emails" ON sent_emails;
DROP POLICY IF EXISTS "Users can insert their own sent emails" ON sent_emails;

-- Add a comment explaining the security model
COMMENT ON TABLE sent_emails IS 'Email security handled at API layer with Clerk authentication and sender_id filtering'; 