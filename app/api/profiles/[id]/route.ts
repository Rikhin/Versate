import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Mock profile data
  const profile = {
    id: params.id,
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'This is a mock profile',
  };

  return NextResponse.json(profile);
}
