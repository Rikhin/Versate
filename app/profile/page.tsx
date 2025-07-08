'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Loader2, Edit, Save, X, User, Mail, MapPin, Calendar, Briefcase, GraduationCap, Heart, Users, Target, Zap } from 'lucide-react';
import { BackgroundGradient, FloatingShapes } from '@/components/scroll-animations';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  experience_level: string;
  interests: string[];
  skills: string[];
  goals: string[];
  availability: string;
  preferred_collaboration: string;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile();
    }
  }, [isLoaded, user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profiles/${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData(data);
      } else {
        toast.error('Failed to load profile');
      }
    } catch (error) {
      toast.error('Error loading profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/profiles/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: keyof Profile, value: string) => {
    if (!value.trim()) return;
    const currentArray = (formData[field] as string[]) || [];
    if (!currentArray.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentArray, value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: keyof Profile, index: number) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index)
    }));
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-helix-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-helix-gradient-start mx-auto mb-4"></div>
          <p className="text-helix-text-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-helix-dark flex items-center justify-center">
        <Card className="w-full max-w-md glass border border-white/10">
          <CardContent className="pt-6">
            <p className="text-center text-helix-text-light">Please sign in to view your profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-helix-dark relative overflow-hidden">
      <BackgroundGradient startColor="from-helix-blue/20" endColor="to-helix-dark-blue/20" triggerStart="top center" triggerEnd="center center" />
      <FloatingShapes count={3} triggerStart="top center" triggerEnd="bottom center" />
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white">Profile</h1>
              <p className="text-xl text-helix-text-light mt-2">Manage your profile information and preferences</p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-3 bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow rounded-full font-bold px-6 py-3">
                <Edit className="h-5 w-5" />
                <span>Edit Profile</span>
              </Button>
            ) : (
              <div className="flex space-x-4">
                <Button onClick={handleCancel} variant="outline" className="flex items-center space-x-3 border-2 border-white/20 text-white hover:bg-white/10 rounded-full font-bold px-6 py-3">
                  <X className="h-5 w-5" />
                  <span>Cancel</span>
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="flex items-center space-x-3 bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow rounded-full font-bold px-6 py-3">
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </Button>
              </div>
            )}
          </div>

          {profile && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <Card className="glass border border-white/10 rounded-[20px] shadow-2xl">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-6">
                      <Avatar className="h-32 w-32 border-4 border-white/20">
                        <AvatarImage src={user.imageUrl} alt={profile.full_name} />
                        <AvatarFallback className="text-2xl bg-white/10 text-white">
                          {profile.full_name?.charAt(0) || user.firstName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="text-2xl text-white font-black">{profile.full_name || user.fullName}</CardTitle>
                    <CardDescription className="text-helix-text-light text-lg">{profile.bio || 'No bio added yet'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Mail className="h-5 w-5 text-helix-gradient-start" />
                      <span className="text-base text-helix-text-light">{user.primaryEmailAddress?.emailAddress}</span>
                    </div>
                    {profile.location && (
                      <div className="flex items-center space-x-4">
                        <MapPin className="h-5 w-5 text-helix-gradient-start" />
                        <span className="text-base text-helix-text-light">{profile.location}</span>
                      </div>
                    )}
                    {profile.experience_level && (
                      <div className="flex items-center space-x-4">
                        <Briefcase className="h-5 w-5 text-helix-gradient-start" />
                        <span className="text-base text-helix-text-light">{profile.experience_level}</span>
                      </div>
                    )}
                    {profile.availability && (
                      <div className="flex items-center space-x-4">
                        <Calendar className="h-5 w-5 text-helix-gradient-start" />
                        <span className="text-base text-helix-text-light">{profile.availability}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Information */}
                <Card className="glass border border-white/10 rounded-[20px] shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl font-black text-white">
                      <User className="h-6 w-6 text-helix-gradient-start" />
                      <span>Basic Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="full_name" className="text-white font-bold">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="full_name"
                            value={formData.full_name || ''}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            placeholder="Enter your full name"
                            className="bg-white/10 border-white/20 text-white placeholder:text-helix-text-light rounded-xl"
                          />
                        ) : (
                          <p className="text-base text-helix-text-light">{profile.full_name || 'Not specified'}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="location" className="text-white font-bold">Location</Label>
                        {isEditing ? (
                          <Input
                            id="location"
                            value={formData.location || ''}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder="Enter your location"
                            className="bg-white/10 border-white/20 text-white placeholder:text-helix-text-light rounded-xl"
                          />
                        ) : (
                          <p className="text-base text-helix-text-light">{profile.location || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="bio" className="text-white font-bold">Bio</Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={formData.bio || ''}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          placeholder="Tell us about yourself"
                          rows={4}
                          className="bg-white/10 border-white/20 text-white placeholder:text-helix-text-light rounded-xl"
                        />
                      ) : (
                        <p className="text-base text-helix-text-light">{profile.bio || 'No bio added yet'}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Experience & Goals */}
                <Card className="glass border border-white/10 rounded-[20px] shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl font-black text-white">
                      <Target className="h-6 w-6 text-helix-gradient-start" />
                      <span>Experience & Goals</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="experience_level" className="text-white font-bold">Experience Level</Label>
                        {isEditing ? (
                          <Select value={formData.experience_level || ''} onValueChange={(value) => handleInputChange('experience_level', value)}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl">
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent className="bg-helix-dark border-white/20">
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                              <SelectItem value="expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-base text-helix-text-light">{profile.experience_level || 'Not specified'}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="availability" className="text-white font-bold">Availability</Label>
                        {isEditing ? (
                          <Select value={formData.availability || ''} onValueChange={(value) => handleInputChange('availability', value)}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl">
                              <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                            <SelectContent className="bg-helix-dark border-white/20">
                              <SelectItem value="full-time">Full-time</SelectItem>
                              <SelectItem value="part-time">Part-time</SelectItem>
                              <SelectItem value="weekends">Weekends only</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-base text-helix-text-light">{profile.availability || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card className="glass border border-white/10 rounded-[20px] shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl font-black text-white">
                      <Zap className="h-6 w-6 text-helix-gradient-start" />
                      <span>Skills</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isEditing && (
                      <div className="flex space-x-4">
                        <Input
                          placeholder="Add a skill"
                          className="bg-white/10 border-white/20 text-white placeholder:text-helix-text-light rounded-xl flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addArrayItem('skills', e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addArrayItem('skills', input.value);
                            input.value = '';
                          }}
                          className="border-2 border-white/20 text-white hover:bg-white/10 rounded-xl font-bold"
                        >
                          Add
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                      {(formData.skills || profile.skills || []).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-2 bg-white/10 border border-white/20 text-helix-text-light px-4 py-2 rounded-full font-bold">
                          <span>{skill}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeArrayItem('skills', index)}
                              className="ml-1 hover:text-red-400 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Interests */}
                <Card className="glass border border-white/10 rounded-[20px] shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl font-black text-white">
                      <Heart className="h-6 w-6 text-helix-gradient-start" />
                      <span>Interests</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isEditing && (
                      <div className="flex space-x-4">
                        <Input
                          placeholder="Add an interest"
                          className="bg-white/10 border-white/20 text-white placeholder:text-helix-text-light rounded-xl flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addArrayItem('interests', e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addArrayItem('interests', input.value);
                            input.value = '';
                          }}
                          className="border-2 border-white/20 text-white hover:bg-white/10 rounded-xl font-bold"
                        >
                          Add
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                      {(formData.interests || profile.interests || []).map((interest, index) => (
                        <Badge key={index} variant="outline" className="flex items-center space-x-2 border-2 border-white/20 text-helix-text-light px-4 py-2 rounded-full font-bold">
                          <span>{interest}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeArrayItem('interests', index)}
                              className="ml-1 hover:text-red-400 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Goals */}
                <Card className="glass border border-white/10 rounded-[20px] shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl font-black text-white">
                      <Target className="h-6 w-6 text-helix-gradient-start" />
                      <span>Goals</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isEditing && (
                      <div className="flex space-x-4">
                        <Input
                          placeholder="Add a goal"
                          className="bg-white/10 border-white/20 text-white placeholder:text-helix-text-light rounded-xl flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addArrayItem('goals', e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addArrayItem('goals', input.value);
                            input.value = '';
                          }}
                          className="border-2 border-white/20 text-white hover:bg-white/10 rounded-xl font-bold"
                        >
                          Add
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                      {(formData.goals || profile.goals || []).map((goal, index) => (
                        <Badge key={index} variant="default" className="flex items-center space-x-2 bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white px-4 py-2 rounded-full font-bold">
                          <span>{goal}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeArrayItem('goals', index)}
                              className="ml-1 hover:text-red-400 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Collaboration Preferences */}
                <Card className="glass border border-white/10 rounded-[20px] shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl font-black text-white">
                      <Users className="h-6 w-6 text-helix-gradient-start" />
                      <span>Collaboration Preferences</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="preferred_collaboration" className="text-white font-bold">Preferred Collaboration Style</Label>
                      {isEditing ? (
                        <Select value={formData.preferred_collaboration || ''} onValueChange={(value) => handleInputChange('preferred_collaboration', value)}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl">
                            <SelectValue placeholder="Select collaboration style" />
                          </SelectTrigger>
                          <SelectContent className="bg-helix-dark border-white/20">
                            <SelectItem value="team-player">Team Player</SelectItem>
                            <SelectItem value="independent">Independent</SelectItem>
                            <SelectItem value="mentor">Mentor</SelectItem>
                            <SelectItem value="learner">Learner</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-base text-helix-text-light">{profile.preferred_collaboration || 'Not specified'}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="glass border border-white/10 rounded-[20px] shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-black text-white">Social Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="website" className="text-white font-bold">Website</Label>
                        {isEditing ? (
                          <Input
                            id="website"
                            value={formData.website || ''}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            placeholder="https://yourwebsite.com"
                            className="bg-white/10 border-white/20 text-white placeholder:text-helix-text-light rounded-xl"
                          />
                        ) : (
                          <p className="text-base text-helix-text-light">{profile.website || 'Not specified'}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="github" className="text-white font-bold">GitHub</Label>
                        {isEditing ? (
                          <Input
                            id="github"
                            value={formData.github || ''}
                            onChange={(e) => handleInputChange('github', e.target.value)}
                            placeholder="https://github.com/username"
                            className="bg-white/10 border-white/20 text-white placeholder:text-helix-text-light rounded-xl"
                          />
                        ) : (
                          <p className="text-base text-helix-text-light">{profile.github || 'Not specified'}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="linkedin" className="text-white font-bold">LinkedIn</Label>
                        {isEditing ? (
                          <Input
                            id="linkedin"
                            value={formData.linkedin || ''}
                            onChange={(e) => handleInputChange('linkedin', e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="bg-white/10 border-white/20 text-white placeholder:text-helix-text-light rounded-xl"
                          />
                        ) : (
                          <p className="text-base text-helix-text-light">{profile.linkedin || 'Not specified'}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="twitter" className="text-white font-bold">Twitter</Label>
                        {isEditing ? (
                          <Input
                            id="twitter"
                            value={formData.twitter || ''}
                            onChange={(e) => handleInputChange('twitter', e.target.value)}
                            placeholder="https://twitter.com/username"
                            className="bg-white/10 border-white/20 text-white placeholder:text-helix-text-light rounded-xl"
                          />
                        ) : (
                          <p className="text-base text-helix-text-light">{profile.twitter || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 