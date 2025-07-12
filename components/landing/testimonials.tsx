"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Computer Science Student",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    content: "Versate completely transformed how I found team members for hackathons. I went from struggling to find teammates to winning my first competition within months!",
    rating: 5
  },
  {
    name: "Jamie Rivera",
    role: "Engineering Student",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    content: "The quality of projects and competitions on this platform is outstanding. I've built connections that helped me land an amazing internship.",
    rating: 5
  },
  {
    name: "Taylor Kim",
    role: "Design Student",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    content: "As a designer, finding technical co-founders was always challenging. Versate connected me with brilliant developers who shared my vision.",
    rating: 4
  },
  {
    name: "Morgan Lee",
    role: "Computer Science Student",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    content: "The mentorship opportunities here are incredible. I've learned more in three months than I did in a year of self-study.",
    rating: 5
  },
  {
    name: "Casey Zhang",
    role: "Robotics Enthusiast",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    content: "Finally a platform that understands what student developers need. The project management tools are a game-changer for team collaboration.",
    rating: 5
  },
  {
    name: "Riley Patel",
    role: "AI/ML Student",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    content: "The AI matching system helped me find the perfect team for a research project that got published. Couldn't be happier with the results!",
    rating: 5
  }
];

export function Testimonials({ showAllButton = true }: { showAllButton?: boolean }) {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            What Our Community Says
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of students who have accelerated their learning and career through Versate.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {testimonials.slice(0, 3).map((t, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl shadow p-8 flex flex-col items-center text-center">
              <div className="mb-4">
                <Avatar>
                  <AvatarImage src={t.avatar} alt={t.name} />
                  <AvatarFallback>{t.name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-black" />
                ))}
              </div>
              <p className="text-lg text-gray-800 mb-4">{t.content}</p>
              <div className="font-semibold text-black">{t.name}</div>
              <div className="text-gray-500 text-sm">{t.role}</div>
            </div>
          ))}
        </div>
        {showAllButton && (
          <div className="flex justify-center mt-10">
            <a href="/testimonials" className="px-6 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition">View All</a>
          </div>
        )}
      </div>
    </section>
  );
}
