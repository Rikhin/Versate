-- Test script to check sent_emails table structure and data

-- Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'sent_emails'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'sent_emails';

-- Check total count of emails
SELECT COUNT(*) as total_emails FROM sent_emails;

-- Check emails by status
SELECT status, COUNT(*) as count 
FROM sent_emails 
GROUP BY status;

-- Check recent emails (last 10)
SELECT id, sender_id, email_to, subject, status, sent_at 
FROM sent_emails 
ORDER BY sent_at DESC 
LIMIT 10;

-- Check if there are any emails with null sender_id
SELECT COUNT(*) as emails_with_null_sender 
FROM sent_emails 
WHERE sender_id IS NULL; 