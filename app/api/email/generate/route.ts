import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userProfile, mentorProfile } = await req.json();
    if (!userProfile || !mentorProfile) {
      return NextResponse.json({ error: 'Missing user or mentor profile' }, { status: 400 });
    }

    // Extract user info
    const userName = userProfile.first_name || userProfile.full_name || userProfile.name || 'A student';
    const userGrade = userProfile.grade_level || userProfile.grade || '';
    const userSchool = userProfile.school || userProfile.location || '';
    const userSkills = Array.isArray(userProfile.skills) ? userProfile.skills.join(', ') : (userProfile.skills || '');
    const userRoles = Array.isArray(userProfile.roles) ? userProfile.roles.join(', ') : (userProfile.roles || '');
    const userBio = userProfile.bio || '';
    const userGoal = userProfile.goals || userProfile.interests || userProfile.roles || '';

    // Extract mentor info
    const mentorName = mentorProfile.name?.split(' ')[0] || mentorProfile.first_name || 'there';
    const mentorJob = mentorProfile.jobTitle || mentorProfile.company || mentorProfile.type || '';

    // Subject
    const subject = `Connecting with you via Versate`;

    // Body template
    const body = `Hi ${mentorName},\n\nMy name is ${userName}${userGrade ? ", a " + userGrade : ""}${userSchool ? " at " + userSchool : ""}. I found your profile on Versate and was really interested in your work${mentorJob ? " as a " + mentorJob : ""}.\n\nI'm passionate about${userSkills ? " " + userSkills : " my field"}, and I'm currently looking to${userGoal ? " " + userGoal : " connect with mentors and collaborators"}.\n\nI'd love to connect and learn more about your experience or see if there are ways we could collaborate.\n\nThank you for your time!\n\nBest,\n${userName}`;

    return NextResponse.json({ subject, body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 });
  }
} 