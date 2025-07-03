-- Table for logging sent emails
create table if not exists sent_emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  email_to text not null,
  subject text not null,
  body text not null,
  sent_at timestamptz not null default now()
);

-- Table for storing Composio tokens per user
create table if not exists composio_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz
); 