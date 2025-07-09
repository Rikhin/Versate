import { motion } from "framer-motion";
import { Trophy, Users, Zap, Code, MessageSquare, BookOpen, Award } from "lucide-react";
import { AnimatedWrapper } from "../ui/animated-wrapper";

const features = [
  {
    icon: <Trophy className="w-8 h-8 text-primary" />,
    title: "Proven Success",
    description: "Join a platform where students have won top competitions and built impressive portfolios.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Vibrant Community",
    description: "Connect with like-minded students who share your passion for innovation and technology.",
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Lightning Fast",
    description: "Our optimized platform ensures you spend less time searching and more time building.",
  },
  {
    icon: <Code className="w-8 h-8 text-primary" />,
    title: "Developer Friendly",
    description: "Built with modern technologies and designed for seamless integration with your workflow.",
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-primary" />,
    title: "Real-time Collaboration",
    description: "Chat, share code, and work together in real-time with your team members.",
  },
  {
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    title: "Learning Resources",
    description: "Access exclusive tutorials, templates, and resources to accelerate your learning.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedWrapper delay={0.1} type="fade" direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Why Choose <span className="text-primary">Versate</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're redefining how students connect, collaborate, and compete in the world of technology and innovation.
            </p>
          </div>
        </AnimatedWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedWrapper 
              key={index} 
              delay={0.1 + (index * 0.05)} 
              type="fade" 
              direction="up"
            >
              <motion.div 
                className="p-6 rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                whileHover={{ y: -5 }}
              >
                <div key={index} className="group relative p-6 rounded-xl border border-border/30 bg-card/20 backdrop-blur-sm hover:bg-card/30 transition-all duration-300 h-full">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            </AnimatedWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
