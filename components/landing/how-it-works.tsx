import { motion } from "framer-motion";
import { AnimatedWrapper } from "../ui/animated-wrapper";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Personalized Onboarding",
    description: "Complete a comprehensive questionnaire capturing your achievements, interests, and goals.",
    icon: "📝"
  },
  {
    number: "02",
    title: "AI-Powered Matching",
    description: "Get instant, tailored matches to scholarships, competitions, programs, and mentors.",
    icon: "🤖"
  },
  {
    number: "03",
    title: "Connect & Communicate",
    description: "Message in-app, email mentors, and use AI-generated templates for professional outreach.",
    icon: "💬"
  },
  {
    number: "04",
    title: "Achieve & Grow",
    description: "Win scholarships, join programs, compete, and collaborate with a thriving student community.",
    icon: "🎓"
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 relative bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get started with Versate in just a few simple steps and unlock a world of opportunities.
          </p>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="relative p-8 rounded-xl bg-gray-50 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-3xl mb-4 md:mb-0 md:mr-6 text-black">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-black">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
