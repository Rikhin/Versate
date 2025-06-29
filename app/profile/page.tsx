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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please sign in to view your profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-1">Manage your profile information and preferences</p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleCancel} variant="outline" className="flex items-center space-x-2">
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="flex items-center space-x-2">
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </Button>
              </div>
            )}
          </div>

          {profile && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user.imageUrl} alt={profile.full_name} />
                        <AvatarFallback className="text-lg">
                          {profile.full_name?.charAt(0) || user.firstName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="text-xl">{profile.full_name || user.fullName}</CardTitle>
                    <CardDescription>{profile.bio || 'No bio added yet'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{user.primaryEmailAddress?.emailAddress}</span>
                    </div>
                    {profile.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{profile.location}</span>
                      </div>
                    )}
                    {profile.experience_level && (
                      <div className="flex items-center space-x-3">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{profile.experience_level}</span>
                      </div>
                    )}
                    {profile.availability && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{profile.availability}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Basic Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="full_name"
                            value={formData.full_name || ''}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">{profile.full_name || 'Not specified'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        {isEditing ? (
                          <Input
                            id="location"
                            value={formData.location || ''}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder="Enter your location"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">{profile.location || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={formData.bio || ''}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          placeholder="Tell us about yourself"
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm text-gray-600">{profile.bio || 'No bio added yet'}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Experience & Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Experience & Goals</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="experience_level">Experience Level</Label>
                        {isEditing ? (
                          <Select value={formData.experience_level || ''} onValueChange={(value) => handleInputChange('experience_level', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                              <SelectItem value="expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm text-gray-600">{profile.experience_level || 'Not specified'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="availability">Availability</Label>
                        {isEditing ? (
                          <Select value={formData.availability || ''} onValueChange={(value) => handleInputChange('availability', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full-time">Full-time</SelectItem>
                              <SelectItem value="part-time">Part-time</SelectItem>
                              <SelectItem value="weekends">Weekends only</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm text-gray-600">{profile.availability || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Skills</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing && (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add a skill"
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
                        >
                          Add
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {(formData.skills || profile.skills || []).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{skill}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeArrayItem('skills', index)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Interests */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5" />
                      <span>Interests</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing && (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add an interest"
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
                        >
                          Add
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {(formData.interests || profile.interests || []).map((interest, index) => (
                        <Badge key={index} variant="outline" className="flex items-center space-x-1">
                          <span>{interest}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeArrayItem('interests', index)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Goals</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing && (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add a goal"
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
                        >
                          Add
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {(formData.goals || profile.goals || []).map((goal, index) => (
                        <Badge key={index} variant="default" className="flex items-center space-x-1">
                          <span>{goal}</span>
                          {isEditing && (
                            <button
                              onClick={() => removeArrayItem('goals', index)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Collaboration Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Collaboration Preferences</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferred_collaboration">Preferred Collaboration Style</Label>
                      {isEditing ? (
                        <Select value={formData.preferred_collaboration || ''} onValueChange={(value) => handleInputChange('preferred_collaboration', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select collaboration style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="team-player">Team Player</SelectItem>
                            <SelectItem value="independent">Independent</SelectItem>
                            <SelectItem value="mentor">Mentor</SelectItem>
                            <SelectItem value="learner">Learner</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm text-gray-600">{profile.preferred_collaboration || 'Not specified'}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                  <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        {isEditing ? (
                          <Input
                            id="website"
                            value={formData.website || ''}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            placeholder="https://yourwebsite.com"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">{profile.website || 'Not specified'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        {isEditing ? (
                          <Input
                            id="github"
                            value={formData.github || ''}
                            onChange={(e) => handleInputChange('github', e.target.value)}
                            placeholder="https://github.com/username"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">{profile.github || 'Not specified'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        {isEditing ? (
                          <Input
                            id="linkedin"
                            value={formData.linkedin || ''}
                            onChange={(e) => handleInputChange('linkedin', e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">{profile.linkedin || 'Not specified'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        {isEditing ? (
                          <Input
                            id="twitter"
                            value={formData.twitter || ''}
                            onChange={(e) => handleInputChange('twitter', e.target.value)}
                            placeholder="https://twitter.com/username"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">{profile.twitter || 'Not specified'}</p>
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