import { motion } from "framer-motion";
import { AnimatedWrapper } from "../ui/animated-wrapper";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Set up your profile with your skills, interests, and experience to help us match you with the right opportunities.",
    icon: "👤"
  },
  {
    number: "02",
    title: "Find Opportunities",
    description: "Browse competitions, projects, and teams that match your interests and skill level.",
    icon: "🔍"
  },
  {
    number: "03",
    title: "Connect & Collaborate",
    description: "Join teams, connect with mentors, and start working on exciting projects together.",
    icon: "🤝"
  },
  {
    number: "04",
    title: "Showcase & Succeed",
    description: "Build your portfolio, participate in competitions, and celebrate your achievements with the community.",
    icon: "🏆"
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedWrapper delay={0.1} type="fade" direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Get started with Versate in just a few simple steps and unlock a world of opportunities.
            </p>
          </div>
        </AnimatedWrapper>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2"></div>
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <AnimatedWrapper 
                key={index}
                delay={0.1 * index} 
                type="fade" 
                direction="up"
              >
                <motion.div 
                  className="group relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 -ml-3 top-8 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/30 z-10">
                    {index + 1}
                  </div>
                  
                  {/* Card */}
                  <div className={cn(
                    "relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#0f0c29]/80 to-[#302b63]/80 backdrop-blur-sm border border-white/5",
                    "transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/10",
                    index % 2 === 0 ? "md:mr-auto md:pr-16 md:pl-8" : "md:ml-auto md:pl-16 md:pr-8"
                  )}>
                    <div className="flex flex-col md:flex-row items-start">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-white/5 flex items-center justify-center text-3xl mb-4 md:mb-0 md:mr-6 text-white">
                        {step.icon}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 text-white">
                          {step.title}
                        </h3>
                        <p className="text-white/70 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatedWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
