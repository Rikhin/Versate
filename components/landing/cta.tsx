import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { AnimatedWrapper } from "../ui/animated-wrapper";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29]/30 to-[#302b63]/30" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <AnimatedWrapper delay={0.1} type="fade" direction="up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] bg-clip-text text-transparent">
              Ready to Accelerate Your Journey?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto">
              Join thousands of students who are building the future, one project at a time. It's free to get started!
            </p>
            
            <motion.div 
              className="relative overflow-hidden px-6 py-16 rounded-3xl bg-gradient-to-br from-[#0f0c29]/50 to-[#302b63]/50 backdrop-blur-sm border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full mix-blend-screen blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/5 rounded-full mix-blend-screen blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <SignUpButton mode="modal">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto"
                    >
                      <Button 
                        size="lg" 
                        className="w-full group text-base font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/20"
                      >
                        Get Started for Free
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </SignUpButton>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full group text-base font-semibold bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/30 transition-colors"
                      asChild
                    >
                      <a href="#features">
                        Learn More
                        <svg 
                          className="ml-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 9l-7 7-7-7" 
                          />
                        </svg>
                      </a>
                    </Button>
                  </motion.div>
                </div>
                
                <p className="mt-6 text-sm text-white/60">
                  No credit card required • Cancel anytime
                </p>
              </div>
            </motion.div>
          </AnimatedWrapper>
          
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "750+", label: "Students Connected" },
              { value: "100+", label: "Competitions" },
              { value: "500+", label: "Projects" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <AnimatedWrapper 
                key={index} 
                delay={0.1 + (index * 0.1)} 
                type="fade" 
                direction="up"
              >
                <motion.div
                  className="p-6 rounded-2xl bg-gradient-to-br from-[#0f0c29]/40 to-[#302b63]/40 backdrop-blur-sm border border-white/5 hover:border-primary/50 transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60 mt-1">
                    {stat.label}
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
