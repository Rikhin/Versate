const steps = [
  {
    number: "01",
    title: "Personalized Onboarding",
    description: "Complete a comprehensive questionnaire capturing your achievements, interests, and goals.",
    icon: "📝"
  },
  {
    number: "02",
    title: "AI-Powered Matching",
    description: "Get instant, tailored matches to scholarships, competitions, programs, and mentors.",
    icon: "🤖"
  },
  {
    number: "03",
    title: "Connect & Communicate",
    description: "Message in-app, email mentors, and use AI-generated templates for professional outreach.",
    icon: "💬"
  },
  {
    number: "04",
    title: "Achieve & Grow",
    description: "Win scholarships, join programs, compete, and collaborate with a thriving student community.",
    icon: "🎓"
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 relative bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get started with Versate in just a few simple steps and unlock a world of opportunities.
          </p>
        </div>
        {/* Stepper: horizontal on desktop, vertical on mobile */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-center gap-8 md:gap-0 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative flex-1 flex flex-col items-center md:items-start text-center md:text-left px-0 md:px-6">
              {/* Connector line */}
              {index !== 0 && (
                <div className="hidden md:block absolute left-0 top-8 h-1 w-full bg-gray-200 z-0" style={{ zIndex: 0, left: '-50%', width: '100%' }} />
              )}
              <div className="relative z-10 flex flex-col items-center md:items-start">
                <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mb-4">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-black">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
              {/* Vertical connector for mobile */}
              {index !== steps.length - 1 && (
                <div className="block md:hidden w-1 h-8 bg-gray-200 mx-auto mt-2 mb-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
