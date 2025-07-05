-- Add status and resend_error columns to sent_emails table

-- Add status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sent_emails' AND column_name = 'status') THEN
        ALTER TABLE sent_emails ADD COLUMN status TEXT DEFAULT 'sent';
    END IF;
END $$;

-- Add resend_error column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sent_emails' AND column_name = 'resend_error') THEN
        ALTER TABLE sent_emails ADD COLUMN resend_error TEXT;
    END IF;
END $$;

-- Update existing records to have 'sent' status
UPDATE sent_emails SET status = 'sent' WHERE status IS NULL; 