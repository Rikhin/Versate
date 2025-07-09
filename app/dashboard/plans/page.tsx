"use client";

import { useRouter } from "next/navigation";

export default function PlansPage() {
  const router = useRouter();

  const plans = [
    {
      name: "Starter - Free",
      price: 0,
      description: "Get started with our core features",
      features: [
        "Unlimited search of public competitions",
        "Basic team matching",
        "Community support"
      ],
      cta: "Get Started",
      primary: false,
    },
    {
      name: "Plus",
      price: 9.99,
      description: "For serious competitors",
      features: [
        "Everything in Free",
        "Advanced matching",
        "Priority support"
      ],
      cta: "Start Free Trial",
      primary: true,
    },
    {
      name: "Pro",
      price: 19.99,
      description: "For teams and professionals",
      features: [
        "Everything in Plus",
        "Premium features",
        "Dedicated support"
      ],
      cta: "Start Free Trial",
      primary: false,
    },
  ];

  const handleSelectPlan = (plan: any) => {
    if (plan.name === "Starter - Free") {
      router.push("/dashboard");
    } else {
      window.location.href = 'https://buy.stripe.com/test_28o2bQ4pJc6d3Uc000';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Select the plan that works best for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-xl overflow-hidden shadow-lg ${
                plan.primary ? 'ring-2 ring-blue-500 transform md:-translate-y-2' : 'bg-white'
              }`}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="ml-2 text-gray-500">/month</span>
                  </div>
                  <p className="mt-2 text-gray-600">{plan.description}</p>
                </div>

                <ul className="mb-8 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`mt-auto w-full py-3 px-4 rounded-md font-medium transition-colors ${
                    plan.primary
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}