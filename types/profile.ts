export type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  experience_level?: string;
  interests?: string[];
  skills?: string[];
  goals?: string[];
  availability?: string;
  preferred_collaboration?: string[];
  created_at?: string;
  updated_at?: string;
  avatar_url?: string;
  role?: 'mentor' | 'mentee' | 'both';
  is_mentor?: boolean;
  is_mentee?: boolean;
  timezone?: string;
  communication_preferences?: {
    email?: boolean;
    in_app?: boolean;
    push?: boolean;
  };
};
