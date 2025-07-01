import { createClient as createSupabaseClient } from "@supabase/supabase-js"

console.log("ALL ENV VARS:", process.env);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Supabase ANON KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  })
}

// Database types
export interface Profile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  school: string
  grade_level: string
  bio: string
  skills: string[]
  roles: string[]
  experience_level: string
  time_commitment: string
  collaboration_style: string[]
  location: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Competition {
  id: string
  name: string
  description: string
  category: string
  organizer: string
  registration_deadline: string
  submission_deadline: string
  team_size_min: number
  team_size_max: number
  grade_levels: string[]
  format: string
  skills_needed: string[]
  location: string
  prize_info: string
  website_url?: string
  created_at: string
}

export interface Team {
  id: string
  title: string
  description: string
  competition_id: string
  category: string
  tech_stack: string[]
  team_size_min: number
  team_size_max: number
  needed_roles: string[]
  time_commitment: string
  requirements?: string
  is_public: boolean
  owner_id: string
  status: string
  deadline?: string
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: string
  status: string
  joined_at: string
}

export interface Message {
  id: string
  sender_id: string
  recipient_id?: string
  team_id?: string
  content: string
  message_type: string
  created_at: string
}
