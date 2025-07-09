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
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29]/10 to-[#302b63]/10" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedWrapper delay={0.1} type="fade" direction="up">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Get started with Versate in just a few simple steps and unlock a world of opportunities.
            </p>
          </div>
        </AnimatedWrapper>

        <div className="relative max-w-5xl mx-auto">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full mix-blend-screen blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-secondary/5 rounded-full mix-blend-screen blur-3xl"></div>
          
          <div className="relative space-y-12 md:space-y-8">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <AnimatedWrapper 
                  key={index}
                  delay={0.1 * index} 
                  type="fade" 
                  direction={isEven ? "left" : "right"}
                >
                  <motion.div 
                    className={cn(
                      "group relative flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-16 md:mb-24",
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="w-full md:w-1/2">
                      <motion.div 
                        className="relative h-full"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-[#0f0c29]/50 to-[#302b63]/50 backdrop-blur-sm border border-white/5 group-hover:border-primary/50 transition-all duration-300 h-full">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-2xl mb-6 text-white">
                            {step.icon}
                          </div>
                          <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                          <p className="text-white/70">{step.description}</p>
                        </div>
                      </motion.div>
                    </div>

                    <div className={cn(
                      "hidden md:flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary text-white text-xl font-bold shadow-lg shadow-primary/20",
                      "absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 z-10"
                    )}>
                      {step.number}
                    </div>
                  </motion.div>
                </AnimatedWrapper>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
