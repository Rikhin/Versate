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
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29]/10 to-[#302b63]/10" />
        <div className="absolute -left-1/4 -top-1/4 w-[150%] h-[150%] bg-radial-gradient(ellipse_at_center,rgba(123,97,255,0.05),transparent 70%) opacity-70" />
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

        <div className="relative max-w-6xl mx-auto">
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full mix-blend-screen blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/5 rounded-full mix-blend-screen blur-3xl"></div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <AnimatedWrapper 
                key={index}
                delay={0.1 * index} 
                type="fade" 
                direction="up"
              >
                <motion.div 
                  className="group relative h-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Card glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl blur opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                  
                  {/* Main card */}
                  <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-[#0f0c29]/80 to-[#302b63]/80 backdrop-blur-sm border border-white/5 group-hover:border-primary/50 transition-all duration-300 flex flex-col">
                    {/* Step number */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-white/5 flex items-center justify-center text-3xl mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    
                    {/* Step number badge */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary/30">
                      {step.number}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-white group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                        {step.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed">{step.description}</p>
                    </div>
                    
                    {/* Progress line (except for last item) */}
                    {index < steps.length - 1 && (
                      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full hidden lg:block">
                        <div className="w-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full group-hover:w-full transition-all duration-500 delay-200"></div>
                      </div>
                    )}
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
