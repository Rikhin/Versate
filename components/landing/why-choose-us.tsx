import { motion } from "framer-motion";
import { Trophy, Users, Zap, Code, MessageSquare, BookOpen } from "lucide-react";
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
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29]/20 to-[#302b63]/20" />
        <div className="absolute -top-1/2 -right-1/4 w-full h-[200%] bg-radial-gradient(ellipse_at_center,rgba(123,97,255,0.1),transparent 70%) opacity-50" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedWrapper delay={0.1} type="fade">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#7b61ff] to-[#5ad1ff] bg-clip-text text-transparent">
              Why Choose Versate?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              We&apos;re redefining how students connect, collaborate, and compete in the world of technology and innovation.
            </p>
          </div>
        </AnimatedWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedWrapper 
              key={index} 
              delay={0.1 + (index * 0.05)} 
              type="fade"
            >
              <motion.div 
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-[#0f0c29]/80 to-[#302b63]/80 backdrop-blur-sm border border-white/5 overflow-hidden"
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {/* Card background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
                
                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </AnimatedWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
