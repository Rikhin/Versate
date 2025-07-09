"use client";

import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Zap, Search, Users, TrendingUp } from "lucide-react";

const steps = [
  {
    title: "Sign Up & Create Profile",
    description: "Create your account and set up your profile with your skills, interests, and goals.",
    icon: <Zap className="w-6 h-6" />,
    color: "from-helix-gradient-start to-helix-gradient-mid",
  },
  {
    title: "Find Your Matches",
    description: "Our AI matches you with the perfect mentors and peers based on your profile.",
    icon: <Search className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-400",
  },
  {
    title: "Connect & Collaborate",
    description: "Start conversations, join groups, and work on projects together.",
    icon: <Users className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Grow & Succeed",
    description: "Learn new skills, build your network, and achieve your goals faster.",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "from-green-500 to-emerald-400",
  },
];

const StepCard = ({ step, index, controls }) => (
  <motion.div
    className={`relative group bg-helix-card/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-opacity-50 transition-all duration-300 h-full flex flex-col`}
    initial={{ opacity: 0, y: 20 }}
    animate={controls}
    custom={index}
    whileHover={{ 
      y: -8,
      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
      scale: 1.02
    }}
    transition={{ 
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: index * 0.1
    }}
  >
    <div className="flex items-center mb-4">
      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mr-4`}>
        {step.icon}
      </div>
      <div className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-helix-gradient-start to-helix-gradient-end">
        0{index + 1}
      </div>
    </div>
    <h3 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
    <p className="text-muted-foreground flex-grow">{step.description}</p>
  </motion.div>
);

const AnimatedArrow = ({ delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ 
      opacity: [0, 1, 0],
      x: [0, 20, 40],
    }}
    viewport={{ once: true }}
    transition={{ 
      duration: 2,
      delay,
      repeat: Infinity,
      repeatDelay: 0.5,
      ease: "easeInOut"
    }}
    className="hidden md:flex items-center justify-center text-helix-gradient-mid"
  >
    <ArrowRight className="w-8 h-8" />
  </motion.div>
);

export default function HowItWorks() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start((i) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * 0.1,
          duration: 0.5,
        },
      }));
    }
  }, [controls, inView]);

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" ref={ref}>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end bg-clip-text text-transparent">
          How It Works
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Get started in just a few simple steps and unlock your full potential with our platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={step.title} className="relative">
            <StepCard 
              step={step} 
              index={index} 
              controls={controls} 
            />
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2">
                <AnimatedArrow delay={index * 0.2} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <button className="px-8 py-3 bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white font-medium rounded-full hover:shadow-lg hover:shadow-helix-gradient-start/30 transition-all duration-300 transform hover:-translate-y-1">
          Get Started Now
        </button>
      </div>
    </section>
  );
}
