import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { AnimatedWrapper } from "../ui/animated-wrapper";

export function CTA() {
  return (
    <section className="py-24 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <AnimatedWrapper delay={0.1} type="fade" direction="up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Ready to Accelerate Your <span className="text-primary">Journey</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Join thousands of students who are building the future, one project at a time. It's free to get started!
            </p>
            
            <div className="relative overflow-hidden px-6 py-16 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm border border-border/20">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <SignUpButton mode="modal">
                  <Button 
                    size="lg" 
                    className="group text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Get Started for Free
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </SignUpButton>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base font-semibold group"
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
              </div>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required • Cancel anytime
            </p>
          </AnimatedWrapper>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
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
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              </AnimatedWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
