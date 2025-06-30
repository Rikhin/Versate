import { createClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Users, TrendingUp, MapPin, ArrowLeft } from "lucide-react";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("id, title, authors, category, description, awards, created_at, country, state, city, school")
    .eq("id", params.id)
    .single();

  if (!project || error) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <Link href="/explore" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Explore
        </Link>
        <Card>
          <CardHeader>
            <Badge variant="secondary" className="mb-2">{project.category}</Badge>
            <CardTitle className="text-2xl font-bold mb-2">{project.title}</CardTitle>
            <CardDescription className="mb-4">{project.description}</CardDescription>
            <div className="flex items-center space-x-3 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={"/placeholder-user.jpg"} alt={project.authors?.[0] || "?"} />
                <AvatarFallback>{project.authors?.[0] || "?"}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{project.authors}</span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-2">
              <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(project.created_at).toLocaleDateString()}</div>
              {project.awards && <div className="flex items-center gap-1"><TrendingUp className="h-4 w-4" />{project.awards}</div>}
              {project.country && <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{project.country}{project.state ? `, ${project.state}` : ""}{project.city ? `, ${project.city}` : ""}</div>}
              {project.school && <div className="flex items-center gap-1"><Users className="h-4 w-4" />{project.school}</div>}
            </div>
          </CardHeader>
          <CardContent>
            {/* Add more details here if needed */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 