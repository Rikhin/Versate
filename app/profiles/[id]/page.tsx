import { createClient } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProfileDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createClient()
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", id)
    .single()

  if (!profile || error) return notFound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <Link href="/profiles" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profiles
        </Link>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatar_url || "/placeholder-user.jpg"} alt={profile.first_name} />
                <AvatarFallback>{profile.first_name[0]}{profile.last_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">{profile.first_name} {profile.last_name}</CardTitle>
                <CardDescription>{profile.grade_level || "Student"}</CardDescription>
                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{profile.location || "Location not specified"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <Badge variant="outline">{profile.experience_level || "Beginner"}</Badge>
              <Badge variant="outline">{profile.time_commitment || "Flexible"}</Badge>
              <Badge variant="outline">{profile.location || "Location not specified"}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.bio && (
              <div>
                <p className="text-slate-700">{profile.bio}</p>
              </div>
            )}
            {profile.roles && profile.roles.length > 0 && (
              <div>
                <p className="text-sm text-slate-600 mb-2">Looking for:</p>
                <Badge variant="outline" className="text-xs">
                  {profile.roles.join(", ")}
                </Badge>
              </div>
            )}
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <p className="text-sm text-slate-600 mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {profile.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 