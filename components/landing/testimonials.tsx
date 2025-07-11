"use client";

import { AnimatedWrapper } from "../ui/animated-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Star } from "lucide-react";
import { Button } from "../ui/button";
import Link from 'next/link';
import { motion, AnimatePresence } from "../ui/motion";

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

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29]/20 to-[#302b63]/20" />
        <div className="absolute -right-1/4 -bottom-1/4 w-[150%] h-[150%] bg-radial-gradient(ellipse_at_center,rgba(123,97,255,0.05),transparent 70%) opacity-70" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedWrapper delay={0.1} type="fade">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] bg-clip-text text-transparent">
              What Our Community Says
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Join thousands of students who have accelerated their learning and career through Versate.
            </p>
          </div>
        </AnimatedWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full mix-blend-screen blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/5 rounded-full mix-blend-screen blur-3xl"></div>
          
          {testimonials.map((testimonial, index) => (
            <AnimatedWrapper 
              key={index} 
              delay={0.1 + (index * 0.1)} 
              type="fade"
            >
              <motion.article 
                className="group relative h-full p-8 rounded-2xl bg-gradient-to-br from-[#0f0c29]/80 to-[#302b63]/80 backdrop-blur-sm border border-white/5 overflow-hidden"
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {/* Card glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl blur opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
                
                <div className="relative z-10 h-full flex flex-col">
                  {/* Testimonial content */}
                  <div className="flex-1">
                    <div className="flex items-start mb-6">
                      <Avatar className="h-16 w-16 mr-4 border-2 border-white/10 group-hover:border-primary/50 transition-colors duration-300">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback className="bg-white/10 text-white group-hover:bg-primary/20 transition-colors duration-300">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="w-full"
                              >
                                <h4 className="text-lg font-bold text-white group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                                  {testimonial.name}
                                </h4>
                                <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">
                                  {testimonial.role}
                                </p>
                              </motion.div>
                            </AnimatePresence>
                            <div className="flex mt-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-white/20'} group-hover:scale-110 transition-transform duration-300`} 
                                  style={{ transitionDelay: `${i * 50}ms` }}
                                />
                              ))}
                            </div>
                          </div>
                          
                          {/* Rating */}
                          <div className="flex items-center space-x-1 bg-white/5 px-2 py-1 rounded-full border border-white/5 group-hover:border-primary/30 transition-colors duration-300">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-white/90">{testimonial.rating}.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Testimonial text */}
                    <blockquote className="relative pl-6 before:absolute before:left-0 before:top-0 before:text-5xl before:leading-none before:opacity-10 before:font-serif before:content-['\201C'] before:text-white group-hover:before:bg-gradient-to-r group-hover:before:from-primary group-hover:before:to-secondary group-hover:before:bg-clip-text group-hover:before:text-transparent transition-all duration-500">
                      <p className="text-white/80 group-hover:text-white/90 leading-relaxed transition-colors duration-300">
                        {testimonial.content}
                      </p>
                    </blockquote>
                  </div>
                  
                  {/* Company logo or verification badge */}
                  <div className="mt-6 pt-6 border-t border-white/5 group-hover:border-primary/20 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-white/5 flex items-center justify-center text-white/80 group-hover:text-primary transition-colors duration-300">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="currentColor"/>
                            <path d="M7 12L11 16L18 8" stroke="#0f0c29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">Verified Student</span>
                      </div>
                      
                      <div className="text-xs text-white/40 group-hover:text-primary/80 transition-colors duration-300">
                        {index + 1}/{testimonials.length}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            </AnimatedWrapper>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/testimonials">
            <Button 
              className="px-8 py-6 text-lg bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-colors duration-300"
            >
              View More Reviews
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
