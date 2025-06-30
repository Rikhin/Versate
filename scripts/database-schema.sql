-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
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

-- Create competitions table
CREATE TABLE IF NOT EXISTS competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  organizer TEXT,
  registration_deadline DATE,
  submission_deadline DATE,
  team_size_min INTEGER DEFAULT 1,
  team_size_max INTEGER DEFAULT 5,
  grade_levels TEXT[] DEFAULT '{}',
  format TEXT, -- 'virtual', 'in-person', 'hybrid'
  skills_needed TEXT[] DEFAULT '{}',
  location TEXT,
  prize_info TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table (replaces projects)
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  competition_id UUID REFERENCES competitions(id),
  category TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  team_size_min INTEGER DEFAULT 2,
  team_size_max INTEGER DEFAULT 5,
  needed_roles TEXT[] DEFAULT '{}',
  time_commitment TEXT,
  requirements TEXT,
  is_public BOOLEAN DEFAULT true,
  owner_id TEXT NOT NULL,
  status TEXT DEFAULT 'recruiting', -- 'recruiting', 'active', 'completed'
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  role TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id TEXT NOT NULL,
  recipient_id TEXT, -- for direct messages
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE, -- for team chats
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'file', 'image'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (
    (recipient_id IS NOT NULL AND team_id IS NULL) OR 
    (recipient_id IS NULL AND team_id IS NOT NULL)
  )
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'team_invite', 'message', 'deadline_reminder'
  title TEXT NOT NULL,
  content TEXT,
  is_read BOOLEAN DEFAULT false,
  related_id UUID, -- team_id, message_id, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mentors table
CREATE TABLE IF NOT EXISTS mentors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  expertise_areas TEXT[] DEFAULT '{}',
  experience_years INTEGER,
  bio TEXT,
  availability TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create competition_interests table
CREATE TABLE IF NOT EXISTS competition_interests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  competition_id UUID REFERENCES competitions(id),
  interest_level INTEGER DEFAULT 5, -- 1-10 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, competition_id)
);

-- Create projects table for ISEF and other competition projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  authors text,
  category text,
  description text,
  awards text,
  created_at timestamp with time zone DEFAULT now(),
  competition_id text
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_category ON teams(category);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_team_id ON messages(team_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id'));

-- RLS Policies for teams
CREATE POLICY "Anyone can view public teams" ON teams FOR SELECT USING (is_public = true);
CREATE POLICY "Team members can view private teams" ON teams FOR SELECT USING (
  NOT is_public AND (
    owner_id = current_setting('app.current_user_id') OR
    id IN (SELECT team_id FROM team_members WHERE user_id = current_setting('app.current_user_id') AND status = 'accepted')
  )
);
CREATE POLICY "Users can create teams" ON teams FOR INSERT WITH CHECK (owner_id = current_setting('app.current_user_id'));
CREATE POLICY "Team owners can update teams" ON teams FOR UPDATE USING (owner_id = current_setting('app.current_user_id'));

-- RLS Policies for team_members
CREATE POLICY "Team members can view team membership" ON team_members FOR SELECT USING (
  team_id IN (SELECT id FROM teams WHERE owner_id = current_setting('app.current_user_id')) OR
  user_id = current_setting('app.current_user_id')
);
CREATE POLICY "Users can join teams" ON team_members FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can update own membership" ON team_members FOR UPDATE USING (user_id = current_setting('app.current_user_id'));

-- RLS Policies for messages
CREATE POLICY "Users can view their messages" ON messages FOR SELECT USING (
  sender_id = current_setting('app.current_user_id') OR
  recipient_id = current_setting('app.current_user_id') OR
  team_id IN (SELECT team_id FROM team_members WHERE user_id = current_setting('app.current_user_id') AND status = 'accepted')
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (sender_id = current_setting('app.current_user_id'));

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = current_setting('app.current_user_id'));
