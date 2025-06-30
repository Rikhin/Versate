import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook
  const eventType = evt.type;
  
  if (eventType === 'user.created') {
    const { id, first_name, last_name, email_addresses } = evt.data;
    
    if (!id || !email_addresses || email_addresses.length === 0) {
      return new Response('Missing required user data', { status: 400 });
    }

    const email = email_addresses[0].email_address;
    
    try {
      const supabase = createServerClient();
      
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', id)
        .single();

      if (existingProfile) {
        return new Response('Profile already exists', { status: 200 });
      }

      // Create new profile
      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: id,
          first_name: first_name || '',
          last_name: last_name || '',
          email: email,
          school: '',
          grade_level: '',
          bio: '',
          skills: [],
          roles: [],
          experience_level: 'Beginner',
          time_commitment: 'Flexible',
          collaboration_style: [],
          location: '',
        });

      if (error) {
        console.error('Error creating profile:', error);
        return new Response('Error creating profile', { status: 500 });
      }

      return new Response('Profile created successfully', { status: 200 });
    } catch (error) {
      console.error('Webhook error:', error);
      return new Response('Internal server error', { status: 500 });
    }
  }

  return new Response('Webhook processed', { status: 200 });
} 