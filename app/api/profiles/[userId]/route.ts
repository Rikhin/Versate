import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = createServerClient();
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error in GET /api/profiles/[userId]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = createServerClient();
    const body = await request.json();

    // Validate required fields
    const { full_name, bio, location, website, github, linkedin, twitter, experience_level, interests, skills, goals, availability, preferred_collaboration } = body;

    // Update the profile
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({
        full_name,
        bio,
        location,
        website,
        github,
        linkedin,
        twitter,
        experience_level,
        interests,
        skills,
        goals,
        availability,
        preferred_collaboration,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error in PUT /api/profiles/[userId]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 