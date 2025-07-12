import { Trophy, Users, Zap, MessageSquare, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: <Trophy className="w-8 h-8 text-black" />,
    title: "Curated Opportunity Database",
    description: "Thousands of scholarships, competitions, summer programs, and mentors—curated for every student.",
  },
  {
    icon: <Zap className="w-8 h-8 text-black" />,
    title: "AI-Powered Matching",
    description: "Our RAG pipeline instantly matches you with the best-fit opportunities based on your unique profile.",
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-black" />,
    title: "Comprehensive Communication Suite",
    description: "In-app messaging, external email integration, and AI-generated email templates for seamless outreach.",
  },
  {
    icon: <Users className="w-8 h-8 text-black" />,
    title: "Expert & Mentor Network",
    description: "Connect with experienced college counselors, industry professionals, and academic mentors.",
  },
  {
    icon: <BookOpen className="w-8 h-8 text-black" />,
    title: "Personalized Learning Resources",
    description: "Access curated content, guides, and tools tailored to your academic journey.",
  },
];

export function WhyChooseUs() {
  const [active, setActive] = useState(0);
  const cardCount = features.length;

  // Arrow navigation with wrap-around
  const goLeft = () => setActive((prev) => (prev - 1 + cardCount) % cardCount);
  const goRight = () => setActive((prev) => (prev + 1) % cardCount);

  // Only show cards at positions -2, -1, 0, 1, 2 relative to active
  const visibleRange = 2;

  // Calculate card style for oval effect, with fixed positions
  const getCardStyle = (idx: number) => {
    let pos = idx - active;
    // Wrap around for infinite carousel
    if (pos > cardCount / 2) pos -= cardCount;
    if (pos < -cardCount / 2) pos += cardCount;
    if (Math.abs(pos) > visibleRange) return { display: "none" };
    // Evenly distribute visible cards
    const x = pos * 220;
    const y = -Math.pow(pos, 2) * 18 + 24 * Math.cos((pos * Math.PI) / 4);
    const scale = pos === 0 ? 1.18 : 0.92 - Math.abs(pos) * 0.08;
    const opacity = pos === 0 ? 1 : 0.5 + 0.2 * (visibleRange - Math.abs(pos)) / visibleRange;
    const zIndex = 10 - Math.abs(pos);
    const filter = pos === 0 ? "none" : "grayscale(0.5)";
    const boxShadow = pos === 0 ? "0 8px 32px 0 rgba(0,0,0,0.10)" : "0 2px 8px 0 rgba(0,0,0,0.04)";
    const pointerEvents = pos === 0 ? "auto" : "none";
    return {
      transform: `translateX(${x}px) translateY(${y}px) scale(${scale})`,
      opacity,
      zIndex,
      filter,
      boxShadow,
      pointerEvents: pointerEvents as 'auto' | 'none',
      transition:
        "transform 0.5s cubic-bezier(.4,0,.2,1), opacity 0.4s, filter 0.4s, box-shadow 0.4s",
      position: "absolute" as const,
      top: 0,
      left: "50%",
      width: "340px",
      marginLeft: "-170px",
      background: "#fff",
      borderRadius: "1.5rem",
      border: "1px solid #eee",
      padding: "2.5rem 2rem 2rem 2rem",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      boxSizing: "border-box" as const,
    };
  };

  return (
    <section className="py-24 bg-white flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Why Choose Us?</h2>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed md:leading-loose">
          We’re redefining how students connect, collaborate, and compete in the world of technology and innovation.
        </p>
      </div>
      <div
        className="relative flex items-center justify-center"
        style={{ height: 340, width: "100%", maxWidth: 900, margin: "0 auto", overflow: "visible" }}
      >
        {/* Cards on oval path */}
        <div
          className="relative"
          style={{ height: 340, width: "100%", maxWidth: 900 }}
        >
          {features.map((feature, idx) => (
            <div key={idx} style={getCardStyle(idx)}>
              <div className="mb-4">{feature.icon}</div>
              <h3 className={`text-xl font-bold mb-2 text-center ${active === idx ? "text-black" : "text-gray-500"}`}>
                {feature.title}
              </h3>
              <p className="text-gray-500 text-center text-base font-normal max-w-xs">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Arrow controls */}
      <div className="flex items-center justify-center gap-8 mt-8">
        <button
          aria-label="Previous"
          onClick={goLeft}
          className="rounded-full bg-white border border-gray-200 shadow hover:bg-gray-100 p-2 transition"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex gap-2">
          {features.map((_, idx) => (
            <span
              key={idx}
              className={`inline-block w-2 h-2 rounded-full ${active === idx ? "bg-gray-800" : "bg-gray-300"}`}
            />
          ))}
        </div>
        <button
          aria-label="Next"
          onClick={goRight}
          className="rounded-full bg-white border border-gray-200 shadow hover:bg-gray-100 p-2 transition"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
      {/* Hide scrollbar globally for this section */}
      <style>{`
        .why-choose-us-carousel::-webkit-scrollbar { display: none; }
        .why-choose-us-carousel { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

export default WhyChooseUs;
