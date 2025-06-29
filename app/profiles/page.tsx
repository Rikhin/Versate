"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Trophy, 
  Users, 
  Target, 
  Star, 
  ArrowRight, 
  Code, 
  Award, 
  Zap,
  Search,
  Filter,
  MapPin,
  School,
  Calendar,
  MessageSquare,
  UserCheck,
  TrendingUp,
  ArrowUpDown
} from "lucide-react"
import Link from "next/link"
import { BackgroundGradient, FloatingShapes, TextFade } from "@/components/scroll-animations"

interface Profile {
  id: string
  firstName: string
  lastName: string
  school: string
  gradeLevel: string
  skills: string[]
  roles: string[]
  experienceLevel: string
  bio: string
  location: string
  matchScore: number
  competitions: string[]
  projectsCompleted: number
  teamsJoined: number
  avatar: string
}

const fakeProfiles: Profile[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Chen",
    school: "Stanford University",
    gradeLevel: "College Junior",
    skills: ["Python", "Machine Learning", "Data Science", "React", "Node.js"],
    roles: ["Developer", "Data Scientist", "Team Lead"],
    experienceLevel: "Advanced",
    bio: "Passionate about AI and machine learning. Led multiple successful projects in computer vision and natural language processing.",
    location: "Palo Alto, CA",
    matchScore: 94,
    competitions: ["Congressional App Challenge", "Regeneron ISEF"],
    projectsCompleted: 8,
    teamsJoined: 12,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "2",
    firstName: "Alex",
    lastName: "Rivera",
    school: "MIT",
    gradeLevel: "College Senior",
    skills: ["Arduino", "IoT", "C++", "Python", "Robotics"],
    roles: ["Developer", "Hardware Engineer", "Researcher"],
    experienceLevel: "Expert",
    bio: "Hardware enthusiast with expertise in IoT and robotics. Won multiple competitions in sustainable technology.",
    location: "Cambridge, MA",
    matchScore: 89,
    competitions: ["Regeneron ISEF", "RoboCupJunior"],
    projectsCompleted: 12,
    teamsJoined: 15,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "3",
    firstName: "Priya",
    lastName: "Sharma",
    school: "Harvard University",
    gradeLevel: "College Sophomore",
    skills: ["Flutter", "NLP", "Psychology", "UI/UX Design", "Mobile Development"],
    roles: ["Developer", "UI/UX Designer", "Researcher"],
    experienceLevel: "Intermediate",
    bio: "Interested in mental health technology and creating apps that make a difference in people's lives.",
    location: "Boston, MA",
    matchScore: 91,
    competitions: ["Technovation Girls", "Congressional App Challenge"],
    projectsCompleted: 6,
    teamsJoined: 9,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "4",
    firstName: "Marcus",
    lastName: "Johnson",
    school: "UC Berkeley",
    gradeLevel: "College Freshman",
    skills: ["JavaScript", "React", "TypeScript", "Web Development", "Graphic Design"],
    roles: ["Developer", "Designer", "Student"],
    experienceLevel: "Beginner",
    bio: "New to the tech world but eager to learn and contribute to meaningful projects.",
    location: "Berkeley, CA",
    matchScore: 76,
    competitions: ["Congressional App Challenge"],
    projectsCompleted: 2,
    teamsJoined: 3,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "5",
    firstName: "Emma",
    lastName: "Wilson",
    school: "Yale University",
    gradeLevel: "College Senior",
    skills: ["Business Strategy", "Marketing", "Project Management", "Research", "Writing"],
    roles: ["Project Manager", "Business Analyst", "Team Lead"],
    experienceLevel: "Advanced",
    bio: "Business-minded student with a passion for social entrepreneurship and sustainable business models.",
    location: "New Haven, CT",
    matchScore: 87,
    competitions: ["Diamond Challenge", "DECA Competition"],
    projectsCompleted: 10,
    teamsJoined: 14,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "6",
    firstName: "David",
    lastName: "Kim",
    school: "Georgia Tech",
    gradeLevel: "College Junior",
    skills: ["Java", "C++", "Cybersecurity", "Database Design", "DevOps"],
    roles: ["Developer", "Security Specialist", "Mentor"],
    experienceLevel: "Advanced",
    bio: "Cybersecurity enthusiast with experience in secure software development and ethical hacking.",
    location: "Atlanta, GA",
    matchScore: 92,
    competitions: ["eCYBERMISSION", "Congressional App Challenge"],
    projectsCompleted: 9,
    teamsJoined: 11,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "7",
    firstName: "Isabella",
    lastName: "Martinez",
    school: "University of Texas",
    gradeLevel: "College Sophomore",
    skills: ["Python", "Data Science", "Statistics", "Research", "Writing"],
    roles: ["Data Scientist", "Researcher", "Analyst"],
    experienceLevel: "Intermediate",
    bio: "Data science student passionate about using data to solve real-world problems and drive insights.",
    location: "Austin, TX",
    matchScore: 85,
    competitions: ["Regeneron ISEF", "eCYBERMISSION"],
    projectsCompleted: 7,
    teamsJoined: 8,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "8",
    firstName: "Ryan",
    lastName: "Thompson",
    school: "University of Michigan",
    gradeLevel: "College Senior",
    skills: ["Swift", "iOS Development", "UI/UX Design", "Mobile Development", "Graphic Design"],
    roles: ["Developer", "UI/UX Designer", "Mobile Developer"],
    experienceLevel: "Expert",
    bio: "iOS developer with a keen eye for design. Created several successful apps with millions of downloads.",
    location: "Ann Arbor, MI",
    matchScore: 88,
    competitions: ["Congressional App Challenge", "Technovation Girls"],
    projectsCompleted: 11,
    teamsJoined: 13,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "9",
    firstName: "Sophia",
    lastName: "Lee",
    school: "University of Washington",
    gradeLevel: "College Junior",
    skills: ["Blockchain", "Solidity", "Web3", "JavaScript", "Smart Contracts"],
    roles: ["Developer", "Blockchain Developer", "Innovator"],
    experienceLevel: "Advanced",
    bio: "Blockchain developer exploring the future of decentralized applications and Web3 technology.",
    location: "Seattle, WA",
    matchScore: 90,
    competitions: ["Conrad Challenge", "Congressional App Challenge"],
    projectsCompleted: 8,
    teamsJoined: 10,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "10",
    firstName: "Michael",
    lastName: "Brown",
    school: "Carnegie Mellon University",
    gradeLevel: "College Freshman",
    skills: ["Python", "AI", "Machine Learning", "Computer Vision", "Deep Learning"],
    roles: ["Developer", "AI Researcher", "Student"],
    experienceLevel: "Beginner",
    bio: "AI enthusiast learning the ropes of machine learning and computer vision.",
    location: "Pittsburgh, PA",
    matchScore: 82,
    competitions: ["Regeneron ISEF"],
    projectsCompleted: 3,
    teamsJoined: 4,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "11",
    firstName: "Ava",
    lastName: "Garcia",
    school: "University of Florida",
    gradeLevel: "College Sophomore",
    skills: ["Marketing", "Social Media", "Content Creation", "Business Strategy", "Communication"],
    roles: ["Marketing Specialist", "Content Creator", "Communication-focused"],
    experienceLevel: "Intermediate",
    bio: "Marketing student with a talent for creating engaging content and building brand awareness.",
    location: "Gainesville, FL",
    matchScore: 79,
    competitions: ["Diamond Challenge", "DECA Competition"],
    projectsCompleted: 5,
    teamsJoined: 7,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "12",
    firstName: "James",
    lastName: "Davis",
    school: "University of Illinois",
    gradeLevel: "College Senior",
    skills: ["Robotics", "IoT", "Arduino", "C++", "Hardware Engineering"],
    roles: ["Hardware Engineer", "Robotics Engineer", "Mentor"],
    experienceLevel: "Expert",
    bio: "Robotics engineer with experience in autonomous systems and IoT applications.",
    location: "Urbana, IL",
    matchScore: 93,
    competitions: ["RoboCupJunior", "Regeneron ISEF"],
    projectsCompleted: 13,
    teamsJoined: 16,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "13",
    firstName: "Olivia",
    lastName: "Taylor",
    school: "University of Virginia",
    gradeLevel: "College Junior",
    skills: ["UI/UX Design", "Graphic Design", "Figma", "Adobe Creative Suite", "Web Design"],
    roles: ["UI/UX Designer", "Designer", "Creative"],
    experienceLevel: "Advanced",
    bio: "Creative designer passionate about creating beautiful and functional user experiences.",
    location: "Charlottesville, VA",
    matchScore: 86,
    competitions: ["Technovation Girls", "Congressional App Challenge"],
    projectsCompleted: 9,
    teamsJoined: 12,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "14",
    firstName: "Ethan",
    lastName: "Anderson",
    school: "University of Wisconsin",
    gradeLevel: "College Freshman",
    skills: ["JavaScript", "React", "Node.js", "Web Development", "Database Design"],
    roles: ["Developer", "Web Developer", "Student"],
    experienceLevel: "Beginner",
    bio: "Web development enthusiast learning modern frameworks and building responsive applications.",
    location: "Madison, WI",
    matchScore: 74,
    competitions: ["Congressional App Challenge"],
    projectsCompleted: 2,
    teamsJoined: 3,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "15",
    firstName: "Mia",
    lastName: "Rodriguez",
    school: "University of Arizona",
    gradeLevel: "College Sophomore",
    skills: ["Research", "Writing", "Data Analysis", "Statistics", "Psychology"],
    roles: ["Researcher", "Analyst", "Communication-focused"],
    experienceLevel: "Intermediate",
    bio: "Research-oriented student with strong analytical skills and a passion for understanding human behavior.",
    location: "Tucson, AZ",
    matchScore: 81,
    competitions: ["Regeneron ISEF", "eCYBERMISSION"],
    projectsCompleted: 6,
    teamsJoined: 8,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "16",
    firstName: "Noah",
    lastName: "White",
    school: "University of Colorado",
    gradeLevel: "College Senior",
    skills: ["Project Management", "Business Strategy", "Leadership", "Communication", "Analytics"],
    roles: ["Project Manager", "Team Lead", "Business Analyst"],
    experienceLevel: "Advanced",
    bio: "Natural leader with experience managing complex projects and building high-performing teams.",
    location: "Boulder, CO",
    matchScore: 89,
    competitions: ["Diamond Challenge", "DECA Competition"],
    projectsCompleted: 11,
    teamsJoined: 14,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "17",
    firstName: "Chloe",
    lastName: "Harris",
    school: "University of Oregon",
    gradeLevel: "College Junior",
    skills: ["Sustainability", "Environmental Science", "Data Science", "Research", "Writing"],
    roles: ["Researcher", "Environmental Scientist", "Analyst"],
    experienceLevel: "Intermediate",
    bio: "Environmental science student focused on sustainable solutions and data-driven research.",
    location: "Eugene, OR",
    matchScore: 84,
    competitions: ["Regeneron ISEF", "Conrad Challenge"],
    projectsCompleted: 7,
    teamsJoined: 9,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "18",
    firstName: "Lucas",
    lastName: "Clark",
    school: "University of Maryland",
    gradeLevel: "College Freshman",
    skills: ["Python", "Machine Learning", "Data Science", "Statistics", "Research"],
    roles: ["Data Scientist", "Researcher", "Student"],
    experienceLevel: "Beginner",
    bio: "Data science student excited to explore machine learning and statistical analysis.",
    location: "College Park, MD",
    matchScore: 77,
    competitions: ["eCYBERMISSION"],
    projectsCompleted: 3,
    teamsJoined: 4,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "19",
    firstName: "Zoe",
    lastName: "Lewis",
    school: "University of North Carolina",
    gradeLevel: "College Sophomore",
    skills: ["Marketing", "Business Strategy", "Social Media", "Content Creation", "Communication"],
    roles: ["Marketing Specialist", "Business Analyst", "Content Creator"],
    experienceLevel: "Intermediate",
    bio: "Marketing student with a creative approach to business strategy and brand development.",
    location: "Chapel Hill, NC",
    matchScore: 83,
    competitions: ["Diamond Challenge", "DECA Competition"],
    projectsCompleted: 6,
    teamsJoined: 8,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "20",
    firstName: "William",
    lastName: "Walker",
    school: "University of Minnesota",
    gradeLevel: "College Senior",
    skills: ["Cybersecurity", "Network Security", "Python", "Linux", "Ethical Hacking"],
    roles: ["Security Specialist", "Developer", "Mentor"],
    experienceLevel: "Expert",
    bio: "Cybersecurity expert with certifications and experience in network security and ethical hacking.",
    location: "Minneapolis, MN",
    matchScore: 95,
    competitions: ["eCYBERMISSION", "Congressional App Challenge"],
    projectsCompleted: 14,
    teamsJoined: 17,
    avatar: "/placeholder-user.jpg"
  }
]

export default function ProfilesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("matchScore")
  const [filterExperience, setFilterExperience] = useState("all")
  const [filterLocation, setFilterLocation] = useState("all")

  const filteredAndSortedProfiles = useMemo(() => {
    let filtered = fakeProfiles.filter(profile => {
      const matchesSearch = profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           profile.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           profile.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesExperience = filterExperience === "all" || profile.experienceLevel === filterExperience
      const matchesLocation = filterLocation === "all" || profile.location.includes(filterLocation)
      
      return matchesSearch && matchesExperience && matchesLocation
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "matchScore":
          return b.matchScore - a.matchScore
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        case "school":
          return a.school.localeCompare(b.school)
        case "experience":
          const experienceOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3, "Expert": 4 }
          return experienceOrder[a.experienceLevel as keyof typeof experienceOrder] - experienceOrder[b.experienceLevel as keyof typeof experienceOrder]
        case "projects":
          return b.projectsCompleted - a.projectsCompleted
        case "teams":
          return b.teamsJoined - a.teamsJoined
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, sortBy, filterExperience, filterLocation])

  const locations = Array.from(new Set(fakeProfiles.map(p => p.location.split(',')[0]))).sort()

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Animations */}
      <BackgroundGradient 
        startColor="from-gray-50/50" 
        endColor="to-gray-100/50" 
        triggerStart="top center"
        triggerEnd="center center"
      />
      <FloatingShapes 
        count={3} 
        triggerStart="top center"
        triggerEnd="bottom center"
      />
      
      {/* Main Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Trophy className="h-8 w-8 text-black" />
                <div>
                  <span className="text-2xl font-black text-black">ColabBoard</span>
                  <p className="text-sm text-gray-600">Student Profiles</p>
                </div>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-8 py-16">
          <TextFade triggerStart="top 80%" triggerEnd="center center" stagger={0.1}>
            {/* Header Section */}
            <div className="text-center mb-16">
              <h1 className="text-6xl md:text-7xl font-black text-black mb-8 leading-none">
                Find Your
                <br />
                <span className="text-gray-400">Perfect Teammate</span>
              </h1>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Connect with talented students from top universities and build amazing teams together
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-12 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search by name, school, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-lg border-2 border-gray-300 focus:border-black"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-14 text-lg border-2 border-gray-300 focus:border-black min-w-[200px]">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matchScore">Match Score</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="experience">Experience Level</SelectItem>
                    <SelectItem value="projects">Projects Completed</SelectItem>
                    <SelectItem value="teams">Teams Joined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <Select value={filterExperience} onValueChange={setFilterExperience}>
                  <SelectTrigger className="h-14 text-lg border-2 border-gray-300 focus:border-black min-w-[200px]">
                    <SelectValue placeholder="Filter by experience..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Experience Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="h-14 text-lg border-2 border-gray-300 focus:border-black min-w-[200px]">
                    <SelectValue placeholder="Filter by location..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-8">
              <p className="text-lg text-gray-600">
                Showing {filteredAndSortedProfiles.length} of {fakeProfiles.length} profiles
              </p>
            </div>

            {/* Profiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProfiles.map((profile) => (
                <Card key={profile.id} className="border-0 shadow-none bg-transparent hover:scale-105 transition-transform cursor-pointer">
                  <CardHeader className="pb-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="border-2 border-black text-black px-4 py-2 text-sm font-bold uppercase tracking-widest">
                        {profile.experienceLevel}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-black" />
                        <span className="text-sm font-bold text-black">{profile.matchScore}% match</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profile.avatar} alt={profile.firstName} />
                        <AvatarFallback className="bg-black text-white font-bold text-xl">
                          {profile.firstName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-2xl font-black text-black">{profile.firstName} {profile.lastName}</CardTitle>
                        <CardDescription className="text-lg text-gray-600">{profile.school}</CardDescription>
                        <div className="flex items-center space-x-2 mt-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{profile.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-gray-600 mb-4 leading-relaxed">{profile.bio}</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-black mb-3">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="outline" className="border-2 border-gray-300 text-gray-700 px-3 py-1 text-sm font-bold">
                            {skill}
                          </Badge>
                        ))}
                        {profile.skills.length > 4 && (
                          <Badge variant="outline" className="border-2 border-gray-300 text-gray-700 px-3 py-1 text-sm font-bold">
                            +{profile.skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-black mb-3">Preferred Roles</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.roles.map((role) => (
                          <Badge key={role} variant="outline" className="border-2 border-black text-black px-3 py-1 text-sm font-bold">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-lg text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>{profile.teamsJoined} teams</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-5 w-5" />
                        <span>{profile.projectsCompleted} projects</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1 bg-black text-white hover:bg-gray-800 py-4 text-lg font-bold">
                        <MessageSquare className="h-5 w-5 mr-3" />
                        Message
                      </Button>
                      <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white py-4 text-lg font-bold">
                        <UserCheck className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredAndSortedProfiles.length === 0 && (
              <div className="text-center py-16">
                <div className="text-4xl font-black text-gray-400 mb-4">No profiles found</div>
                <p className="text-xl text-gray-600 mb-8">Try adjusting your search or filters</p>
                <Button 
                  onClick={() => {
                    setSearchTerm("")
                    setFilterExperience("all")
                    setFilterLocation("all")
                  }}
                  className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-bold"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TextFade>
        </div>
      </div>
    </div>
  )
}
