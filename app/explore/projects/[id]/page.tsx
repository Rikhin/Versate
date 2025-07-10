import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp, MapPin, ArrowLeft } from "lucide-react";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Project ${id} - Versate`,
    description: 'Project details and information.',
  };
}

export default async function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const supabase = createClient();

  // Fetch project details from database
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-helix-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        {/* Back Button */}
        <Link href="/explore/projects" className="inline-flex items-center text-helix-text-light hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              {project.category || 'Project'}
            </Badge>
            {project.status && (
              <Badge variant="outline" className="border-green-500 text-green-400">
                {project.status}
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            {project.title || `Project ${id}`}
          </h1>
          
          <p className="text-xl text-helix-text-light max-w-4xl">
            {project.description || 'Project description coming soon...'}
          </p>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="glass border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-helix-gradient-start" />
                <div>
                  <p className="text-sm text-helix-text-light">Team Size</p>
                  <p className="text-xl font-semibold text-white">
                    {project.team_size || 'TBD'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-helix-gradient-start" />
                <div>
                  <p className="text-sm text-helix-text-light">Created</p>
                  <p className="text-xl font-semibold text-white">
                    {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-helix-gradient-start" />
                <div>
                  <p className="text-sm text-helix-text-light">Progress</p>
                  <p className="text-xl font-semibold text-white">
                    {project.progress || 'Planning'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Project Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-helix-text-light">
                  <p>
                    {project.description || 'Detailed project information will be available soon.'}
                  </p>
                  
                  {project.technologies && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.split(',').map((tech: string) => (
                          <Badge key={tech.trim()} variant="outline" className="border-white/20 text-white">
                            {tech.trim()}
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
                <CardTitle className="text-white">Team Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-helix-text-light">
                  <p>
                    Team details and member information will be displayed here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Get Involved</CardTitle>
                <CardDescription className="text-helix-text-light">
                  Interested in this project? Connect with the team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow">
                    Contact Team
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Join Project
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Similar Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-helix-text-light">
                    Discover other projects in this category.
                  </p>
                  <Link href="/explore/projects">
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      Browse All Projects
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 