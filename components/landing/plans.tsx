import React from "react";

const plans = [
  {
    name: "Lite - Lifetime Access",
    price: "$49.99",
    oldPrice: "$99.99",
    features: [
      "Access to all competitions & scholarships",
      "Basic AI search & matching",
      "10 queries per day",
      "Browse summer programs",
      "View mentor profiles",
      "Save favorite opportunities",
      "Email support",
    ],
    cta: "Get Lite Plan",
    highlight: false,
    border: false,
  },
  {
    name: "Basic - Lifetime Access",
    price: "$99.99",
    oldPrice: "$149.99",
    features: [
      "Everything in Lite",
      "Advanced AI matching",
      "20 queries per day",
      "Mentor messaging",
      "Personalized recommendations",
      "Priority email support",
      "Early access to new features",
    ],
    cta: "Get Basic Plan",
    highlight: true,
    border: true, // <-- Only this plan has border
  },
  {
    name: "Pro - Lifetime Access",
    price: "$199.99",
    oldPrice: "$299.99",
    features: [
      "Everything in Basic",
      "Unlimited queries",
      "Priority support",
      "1:1 onboarding call",
      "Direct mentor introductions",
      "Custom AI recommendations",
      "Beta access to all new tools",
    ],
    cta: "Get Pro Plan",
    highlight: false,
    border: false,
  },
];

export default function Plans() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col items-center mb-12">
        <span className="px-4 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium mb-4">One-Time Purchase, Lifetime Access</span>
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-2">Skip Months of Research</h2>
        <p className="text-gray-600 text-center max-w-2xl">Get instant access to validated academic opportunities and mentorship. Start building your future with Versate today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white border ${plan.border ? "border-orange-500" : "border-gray-200"} rounded-2xl shadow-sm p-10 flex flex-col items-center text-center transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 ${plan.highlight ? "border-2 border-black shadow-xl z-10" : ""}`}
            style={{ minHeight: 480, minWidth: 340, maxWidth: 400 }}
          >
            {plan.highlight && (
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black text-white text-xs font-semibold tracking-wide shadow">MOST POPULAR</span>
            )}
            <div className="text-lg font-semibold mb-4 mt-2 tracking-tight">{plan.name}</div>
            <div className="flex items-end justify-center gap-2 mb-6">
              <span className="text-xl line-through text-gray-400 font-light">{plan.oldPrice}</span>
              <span className="text-4xl md:text-5xl font-extrabold text-black tracking-tight">{plan.price}</span>
              <span className="text-base text-gray-400 font-light">USD</span>
            </div>
            <ul className="mb-10 space-y-3 text-gray-700 text-base font-normal text-left max-w-xs mx-auto">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 font-normal">
                  <span className="inline-block w-2 h-2 rounded-full bg-black" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold text-base hover:bg-orange-600 transition mb-2 shadow-sm">{plan.cta}</button>
            <div className="text-xs text-gray-400 font-light">Pay once, own forever. No hidden fees.</div>
          </div>
        ))}
      </div>
    </div>
  );
} 