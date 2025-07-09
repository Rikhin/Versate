import { motion } from "framer-motion";
import { AnimatedWrapper } from "../ui/animated-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Computer Science Student",
    avatar: "/avatars/alex.jpg",
    content: "ColabBoard completely transformed how I found team members for hackathons. I went from struggling to find teammates to winning my first competition within months!",
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
    content: "As a designer, finding technical co-founders was always challenging. ColabBoard connected me with brilliant developers who shared my vision.",
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
    <section className="py-20 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedWrapper delay={0.1} type="fade" direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              What Our <span className="text-primary">Community</span> Says
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of students who have accelerated their learning and career through Versate.
            </p>
          </div>
        </AnimatedWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedWrapper 
              key={index} 
              delay={0.1 + (index * 0.1)} 
              type="fade" 
              direction="up"
            >
              <motion.div 
                className="h-full p-6 rounded-2xl border border-border/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
              </motion.div>
            </AnimatedWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
