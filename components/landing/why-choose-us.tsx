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
    <section className="py-20 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29]/30 to-[#302b63]/30 backdrop-blur-sm" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedWrapper delay={0.1} type="fade" direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] bg-clip-text text-transparent">
              Why Choose Versate?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
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
                key={index} 
                className="p-8 rounded-2xl bg-gradient-to-br from-[#0f0c29]/50 to-[#302b63]/50 backdrop-blur-sm border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            </AnimatedWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
