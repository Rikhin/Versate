import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, MapPin, Award } from 'lucide-react';

export default async function ProfileDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const supabase = createClient();

  // Fetch profile data
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-helix-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        {/* Profile Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <Avatar className="w-32 h-32 border-4 border-white/20">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-2xl bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end">
                {profile.first_name?.[0]}{profile.last_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            {profile.full_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User'}
          </h1>
          
          {profile.bio && (
            <p className="text-xl text-helix-text-light max-w-3xl mx-auto mb-8">
              {profile.bio}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {profile.location && (
              <div className="flex items-center text-helix-text-light">
                <MapPin className="w-4 h-4 mr-2" />
                {profile.location}
              </div>
            )}
            {profile.interests && profile.interests.length > 0 && (
              <div className="flex items-center text-helix-text-light">
                <Award className="w-4 h-4 mr-2" />
                {profile.interests.slice(0, 3).join(', ')}
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <Button className="bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow">
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">About</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-helix-text-light">
                  <p>
                    {profile.bio || 'No bio available yet.'}
                  </p>
                  
                  {profile.interests && profile.interests.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest: string) => (
                          <Badge key={interest} variant="outline" className="border-white/20 text-white">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Skills & Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-helix-text-light">
                  {profile.skills && profile.skills.length > 0 ? (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="border-white/20 text-white">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p>Skills information coming soon...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Projects & Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-helix-text-light">
                  <p>
                    Project and achievement information will be displayed here.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 