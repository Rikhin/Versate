import { notFound } from "next/navigation";
import { competitions } from "@/lib/competitions-data";
import { createClient } from "@/lib/supabase";
import ProjectsTable from "@/components/competitions/ProjectsTable";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function CompetitionPage({ params, searchParams }: { params: { competitionId: string }, searchParams?: { [key: string]: string | string[] | undefined } }) {
  const competition = competitions.find(c => c.id === params.competitionId);
  if (!competition) return notFound();

  // Fetch projects from Supabase for this competition
  const supabase = createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, title, authors, category, description, awards, created_at")
    .eq("competition_id", competition.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-black mb-6 flex items-center gap-4">
          <span className="text-4xl">{competition.icon}</span>
          {competition.name}
        </h1>
        <a
          href={competition.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mb-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Visit Official Website
        </a>
        <div className="mb-8 grid md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-bold mb-2">Overview</h2>
            <p className="mb-4 text-gray-700">{competition.description}</p>
            <h3 className="font-semibold mt-6 mb-1">Purpose, History & Significance</h3>
            <p className="mb-4 text-gray-600">(Add detailed purpose, history, and significance here.)</p>
            <h3 className="font-semibold mt-6 mb-1">Eligibility & Guidelines</h3>
            <ul className="list-disc ml-6 text-gray-700 mb-4">
              {competition.requirements.map(req => <li key={req}>{req}</li>)}
            </ul>
            <h3 className="font-semibold mt-6 mb-1">Important Dates</h3>
            <p className="mb-4 text-gray-700">Deadline: {competition.deadline}</p>
            <h3 className="font-semibold mt-6 mb-1">Registration</h3>
            <p className="mb-4 text-gray-700">(Add registration process details here.)</p>
            <h3 className="font-semibold mt-6 mb-1">Prizes & Awards</h3>
            <p className="mb-4 text-gray-700">{competition.prize}</p>
            <h3 className="font-semibold mt-6 mb-1">Rules & Judging</h3>
            <p className="mb-4 text-gray-700">(Add competition rules and judging criteria here.)</p>
            <h3 className="font-semibold mt-6 mb-1">Contact</h3>
            <p className="mb-4 text-gray-700">(Add contact information for organizers here.)</p>
          </section>
          <section>
            <ProjectsTable
              projects={projects || []}
              error={error}
              competition={competition}
              searchParams={searchParams}
            />
          </section>
        </div>
      </div>
    </div>
  );
} 