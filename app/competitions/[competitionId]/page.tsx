import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { competitions } from '@/lib/competitions-data';

interface PageProps {
  params: Promise<{ competitionId: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { competitionId } = await params;
  const competition = competitions.find(c => c.id === competitionId);
  
  if (!competition) {
    return {
      title: 'Competition Not Found',
      description: 'The requested competition could not be found.',
    };
  }

  return {
    title: `${competition.name} - Versate`,
    description: competition.description,
  };
}

export default async function CompetitionPage({ params }: PageProps) {
  const { competitionId } = await params;
  const competition = competitions.find(c => c.id === competitionId);

  if (!competition) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-helix-dark relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            {competition.name}
          </h1>
          <p className="text-xl md:text-2xl text-helix-text-light max-w-4xl mx-auto">
            {competition.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Competition Details</h2>
              <div className="space-y-4 text-helix-text-light">
                <div>
                  <span className="font-semibold text-white">Status:</span> {competition.status}
                </div>
                <div>
                  <span className="font-semibold text-white">Category:</span> {competition.category}
                </div>
                <div>
                  <span className="font-semibold text-white">Team Required:</span> {competition.teamRequired ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className="font-semibold text-white">Prize:</span> {competition.prize}
                </div>
                <div>
                  <span className="font-semibold text-white">Deadline:</span> {competition.deadline}
                </div>
              </div>
            </div>

            <div className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {competition.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/10 text-white rounded-full text-sm border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">How to Participate</h2>
              <div className="space-y-4 text-helix-text-light">
                <p>
                  Ready to take on this challenge? Connect with teammates, build your project, and submit your entry.
                </p>
                <div className="flex gap-4">
                  <a
                    href={competition.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl glow transition"
                  >
                    Official Website
                  </a>
                  <button className="bg-white/10 text-white px-6 py-3 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition">
                    Find Teammates
                  </button>
                </div>
              </div>
            </div>

            <div className="glass border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Similar Competitions</h2>
              <div className="space-y-4">
                {competitions
                  .filter(c => c.id !== competitionId && c.category === competition.category)
                  .slice(0, 3)
                  .map((comp) => (
                    <div key={comp.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h3 className="font-semibold text-white">{comp.name}</h3>
                      <p className="text-sm text-helix-text-light">{comp.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 