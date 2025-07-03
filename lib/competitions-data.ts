export interface Competition {
  id: string;
  name: string;
  category: string;
  status: "active" | "upcoming" | "past";
  description: string;
  deadline: string;
  prize: string;
  participants: number;
  maxParticipants: number;
  location: string;
  website: string;
  requirements: string[];
  tags: string[];
  icon: string;
  teamRequired?: boolean;
}

const competitions: Competition[] = [
  {
    id: "1",
    name: "Congressional App Challenge",
    category: "Technology",
    status: "active",
    description: "Create an app that solves a problem in your community. Open to high school students across the United States.",
    deadline: "2024-11-01",
    prize: "$250,000 in prizes",
    participants: 2450,
    maxParticipants: 5000,
    location: "United States",
    website: "https://www.congressionalappchallenge.us",
    requirements: ["High school student", "U.S. resident", "Original app"],
    tags: ["Mobile App", "Community", "Innovation"],
    icon: "📱"
  },
  {
    id: "2",
    name: "Regeneron ISEF",
    category: "STEM",
    status: "active",
    description: "The world's largest international pre-college science competition, bringing together young scientists from around the globe.",
    deadline: "2024-05-15",
    prize: "$9 million in awards",
    participants: 1800,
    maxParticipants: 2000,
    location: "Los Angeles, CA",
    website: "https://www.societyforscience.org/isef",
    requirements: ["High school student", "Original research", "Qualification through regional fairs"],
    tags: ["Science", "Research", "International"],
    icon: "🔬"
  },
  {
    id: "3",
    name: "Technovation Girls",
    category: "Technology",
    status: "active",
    description: "Empowering girls to become tech entrepreneurs and leaders by creating mobile apps that address real community problems.",
    deadline: "2024-04-30",
    prize: "$20,000 scholarships",
    participants: 3200,
    maxParticipants: 5000,
    location: "Global",
    website: "https://technovationchallenge.org",
    requirements: ["Girls 10-18", "Team of 1-5", "Mobile app solution"],
    tags: ["Girls in Tech", "Mobile App", "Social Impact"],
    icon: "💻"
  },
  {
    id: "4",
    name: "Diamond Challenge",
    category: "Business",
    status: "active",
    description: "A global entrepreneurship competition for high school students to develop innovative business concepts.",
    deadline: "2024-03-15",
    prize: "$100,000 in prizes",
    participants: 1200,
    maxParticipants: 2000,
    location: "Newark, DE",
    website: "https://diamondchallenge.org",
    requirements: ["High school student", "Team of 2-4", "Business concept"],
    tags: ["Entrepreneurship", "Business", "Innovation"],
    icon: "💎"
  },
  {
    id: "5",
    name: "DECA Competition",
    category: "Business",
    status: "active",
    description: "Prepare emerging leaders and entrepreneurs for careers in marketing, finance, hospitality and management.",
    deadline: "2024-04-20",
    prize: "Scholarships and recognition",
    participants: 15000,
    maxParticipants: 20000,
    location: "Anaheim, CA",
    website: "https://www.deca.org",
    requirements: ["High school student", "DECA membership", "Business case study"],
    tags: ["Business", "Marketing", "Leadership"],
    icon: "🎯"
  },
  {
    id: "6",
    name: "Conrad Challenge",
    category: "STEM",
    status: "upcoming",
    description: "Transform education through innovation and entrepreneurship. Students solve real-world problems using STEM.",
    deadline: "2024-06-30",
    prize: "$500,000 in prizes",
    participants: 800,
    maxParticipants: 1500,
    location: "Kennedy Space Center, FL",
    website: "https://www.conradchallenge.org",
    requirements: ["Ages 13-18", "Team of 2-5", "STEM innovation"],
    tags: ["STEM", "Innovation", "Space"],
    icon: "🚀"
  },
  {
    id: "7",
    name: "RoboCupJunior",
    category: "Robotics",
    status: "upcoming",
    description: "An educational initiative that aims to foster AI and robotics research by offering a readily accessible competition.",
    deadline: "2024-07-15",
    prize: "Trophies and recognition",
    participants: 600,
    maxParticipants: 1000,
    location: "Rotterdam, Netherlands",
    website: "https://junior.robocup.org",
    requirements: ["Ages 19 and under", "Team of 2-4", "Robot design"],
    tags: ["Robotics", "AI", "International"],
    icon: "🤖"
  },
  {
    id: "8",
    name: "eCYBERMISSION",
    category: "STEM",
    status: "upcoming",
    description: "A web-based science, technology, engineering, and mathematics competition for 6th-9th grade teams.",
    deadline: "2024-05-01",
    prize: "$9,000 savings bonds",
    participants: 4000,
    maxParticipants: 6000,
    location: "Washington, DC",
    website: "https://www.ecybermission.com",
    requirements: ["Grades 6-9", "Team of 2-4", "U.S. citizen"],
    tags: ["STEM", "Middle School", "Science"],
    icon: "🔬"
  }
];

import competitionsFromCSV from './competitions-csv.json';

// Ensure CSV competitions are typed correctly
const normalizedCSV = (competitionsFromCSV as any[]).map((c) => ({
  ...c,
  status: c.status === 'upcoming' || c.status === 'past' ? c.status : 'active',
  requirements: Array.isArray(c.requirements) ? c.requirements : [],
  tags: Array.isArray(c.tags) ? c.tags : [],
}));

const mergedCompetitions: Competition[] = [
  ...competitions,
  ...normalizedCSV
];

export { mergedCompetitions as competitions }; 