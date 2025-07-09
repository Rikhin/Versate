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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedWrapper delay={0.1} type="fade" direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started with Versate in just a few simple steps and unlock a world of opportunities.
            </p>
          </div>
        </AnimatedWrapper>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-primary/30 to-primary/30 -translate-x-1/2 hidden md:block"></div>
          
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <AnimatedWrapper 
                  key={index} 
                  delay={0.1 + (index * 0.1)} 
                  type="fade" 
                  direction={isEven ? "left" : "right"}
                >
                  <div 
                    className={cn(
                      "relative flex flex-col md:flex-row items-center justify-between gap-8",
                      !isEven && "md:flex-row-reverse"
                    )}
                  >
                    {/* Left side (for odd steps) or right side (for even steps) */}
                    <div className={cn(
                      "w-full md:w-5/12",
                      isEven ? "md:text-right" : "md:text-left"
                    )}>
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-2xl mb-4 md:hidden">
                        {step.icon}
                      </div>
                      <span className="text-sm font-mono text-primary">{step.number}</span>
                      <h3 className="text-2xl font-bold text-foreground mt-1 mb-3">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                    
                    {/* Center dot */}
                    <div className="hidden md:flex w-16 h-16 rounded-full bg-primary/20 items-center justify-center flex-shrink-0 relative z-10">
                      <div className="w-5 h-5 rounded-full bg-primary"></div>
                      <span className="absolute text-2xl">{step.icon}</span>
                    </div>
                    
                    {/* Right side (for odd steps) or left side (for even steps) */}
                    <div className="hidden md:block w-5/12 opacity-0">
                      {/* Empty div for spacing */}
                    </div>
                  </div>
                </AnimatedWrapper>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
