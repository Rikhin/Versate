import { motion } from "framer-motion";
import { AnimatedWrapper } from "../ui/animated-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Computer Science Student",
    avatar: "/avatars/alex.jpg",
    content: "Versate completely transformed how I found team members for hackathons. I went from struggling to find teammates to winning my first competition within months!",
    rating: 5
  },
  {
    name: "Jamie Rivera",
    role: "Engineering Student",
    avatar: "/avatars/jamie.jpg",
    content: "The quality of projects and competitions on this platform is outstanding. I've built connections that helped me land an amazing internship.",
    rating: 5
  },
  {
    name: "Taylor Kim",
    role: "Design Student",
    avatar: "/avatars/taylor.jpg",
    content: "As a designer, finding technical co-founders was always challenging. Versate connected me with brilliant developers who shared my vision.",
    rating: 4
  },
  {
    name: "Morgan Lee",
    role: "Computer Science Student",
    avatar: "/avatars/morgan.jpg",
    content: "The mentorship opportunities here are incredible. I've learned more in three months than I did in a year of self-study.",
    rating: 5
  },
  {
    name: "Casey Zhang",
    role: "Robotics Enthusiast",
    avatar: "/avatars/casey.jpg",
    content: "Finally a platform that understands what student developers need. The project management tools are a game-changer for team collaboration.",
    rating: 5
  },
  {
    name: "Riley Patel",
    role: "AI/ML Student",
    avatar: "/avatars/riley.jpg",
    content: "The AI matching system helped me find the perfect team for a research project that got published. Couldn't be happier with the results!",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29]/20 to-[#302b63]/20" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedWrapper delay={0.1} type="fade" direction="up">
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
              direction="up"
            >
              <motion.div 
                className="h-full p-8 rounded-2xl bg-gradient-to-br from-[#0f0c29]/50 to-[#302b63]/50 backdrop-blur-sm border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 relative overflow-hidden group"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Decorative accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
                
                <div className="flex items-start mb-6">
                  <Avatar className="h-14 w-14 mr-4 border-2 border-white/10">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-white/10 text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                        <p className="text-sm text-white/60">{testimonial.role}</p>
                      </div>
                      <div className="flex items-center bg-white/5 px-3 py-1 rounded-full">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-white/80 italic relative pl-6 before:content-['\201C'] before:absolute before:left-0 before:top-0 before:text-4xl before:leading-none before:opacity-20 before:font-serif">
                  {testimonial.content}
                </p>
              </motion.div>
            </AnimatedWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
