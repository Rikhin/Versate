import { Trophy, Users, Zap, Code, MessageSquare, BookOpen } from "lucide-react";

const features = [
  {
    icon: <Trophy className="w-8 h-8 text-black" />,
    title: "Curated Opportunity Database",
    description: "Thousands of scholarships, competitions, summer programs, and mentors—curated for every student.",
  },
  {
    icon: <Zap className="w-8 h-8 text-black" />,
    title: "AI-Powered Matching",
    description: "Our RAG pipeline instantly matches you with the best-fit opportunities based on your unique profile.",
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-black" />,
    title: "Comprehensive Communication Suite",
    description: "In-app messaging, external email integration, and AI-generated email templates for seamless outreach.",
  },
  {
    icon: <Users className="w-8 h-8 text-black" />,
    title: "Expert & Mentor Network",
    description: "Connect with experienced college counselors, industry professionals, and academic mentors.",
  },
  {
    icon: <BookOpen className="w-8 h-8 text-black" />,
    title: "Personalized Onboarding",
    description: "A comprehensive questionnaire ensures every recommendation and email is tailored to you.",
  },
  {
    icon: <Code className="w-8 h-8 text-black" />,
    title: "Student Community Hub",
    description: "Peer-to-peer connections, study groups, and collaborative learning built right in.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 relative bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">Why Choose Versate?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We’re redefining how students connect, collaborate, and compete in the world of technology and innovation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="relative p-8 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
