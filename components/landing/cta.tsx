import { Button } from "../ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16 relative bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
          Ready to Unlock Your Academic Future?
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Join Versate—the all-in-one platform for scholarships, competitions, summer programs, and mentorship. Get matched instantly and connect with a thriving student community.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
          <Link href="/sign-up">
            <Button className="bg-black text-white font-semibold rounded-md px-8 py-4 text-lg shadow hover:bg-gray-900 transition border-none">
              Get Started
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="px-8 py-4 text-lg bg-white text-black border-black hover:bg-gray-100 hover:border-gray-900 transition-colors duration-300"
            onClick={() => alert('Demo coming soon!')}
          >
            View Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
