"use client";

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
        <div className="absolute -right-1/4 -bottom-1/4 w-[150%] h-[150%] bg-radial-gradient(ellipse_at_center,rgba(123,97,255,0.05),transparent 70%) opacity-70" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <AnimatedWrapper delay={0.1} type="fade" direction="up">
            <motion.div 
              className="relative overflow-hidden px-8 py-16 rounded-3xl bg-gradient-to-br from-[#0f0c29]/80 to-[#302b63]/80 backdrop-blur-sm border border-white/10 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full mix-blend-screen blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/5 rounded-full mix-blend-screen blur-3xl"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] bg-clip-text text-transparent">
                  Ready to Accelerate Your Journey?
                </h2>
                <p className="text-xl text-white/80 mb-10">
                  Join thousands of students who are building the future, one project at a time. It's free to get started!
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <SignUpButton mode="modal">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto"
                    >
                      <Button 
                        size="lg" 
                        className="w-full group text-base font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                      >
                        <span className="relative z-10">Get Started for Free</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </SignUpButton>
                  
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto"
                  >
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full group text-base font-semibold bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
                      asChild
                    >
                      <a href="#features">
                        <span className="relative z-10">Learn More</span>
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
                
                <p className="mt-8 text-sm text-white/60">
                  No credit card required • Cancel anytime
                </p>
              </div>
              
              {/* Stats grid - removed as per user request */}
            </motion.div>
          </AnimatedWrapper>
          
          {/* Stats section removed as per user request */}
        </div>
      </div>
    </section>
  );
}
