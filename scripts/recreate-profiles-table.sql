-- Complete fix for profiles table
-- Run this in your Supabase SQL Editor

-- Drop the existing profiles table if it exists
DROP TABLE IF EXISTS profiles CASCADE;

-- Create the profiles table with all required columns
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  school TEXT,
  grade_level TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  roles TEXT[] DEFAULT '{}',
  experience_level TEXT,
  time_commitment TEXT,
  collaboration_style TEXT[] DEFAULT '{}',
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id'));

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position; 