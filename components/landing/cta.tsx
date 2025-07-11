import { Button } from "../ui/button";
import Link from "next/link";
import { AnimatedWrapper } from "../ui/animated-wrapper";

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29]/20 to-[#302b63]/20" />
        <div className="absolute -top-1/2 -right-1/4 w-full h-[200%] bg-radial-gradient(ellipse_at_center,rgba(123,97,255,0.1),transparent 70%) opacity-50" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedWrapper delay={0.1} type="fade">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] bg-clip-text text-transparent">
            Ready to Unlock Your Academic Future?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join Versate—the all-in-one platform for scholarships, competitions, summer programs, and mentorship. Get matched instantly and connect with a thriving student community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
            <Link href="/sign-up">
              <Button className="bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] text-white font-semibold rounded-md px-8 py-4 text-lg shadow-lg hover:shadow-xl hover:shadow-[#7b61ff]/30 transition-all hover:scale-105 transform duration-300 border-none">
                Get Started
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="px-8 py-4 text-lg bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-colors duration-300"
              onClick={() => alert('Demo coming soon!')}
            >
              View Demo
            </Button>
          </div>
        </AnimatedWrapper>
      </div>
    </section>
  );
}
