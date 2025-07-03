"use client";
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Rocket, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const versaGradient = "bg-gradient-to-r from-blue-600 via-green-500 to-purple-600";
const versaTextGradient = "bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent";

const plans = [
  {
    name: "Starter - Free",
    price: 0,
    oldPrice: null,
    priceId: null,
    description: "Get started with Versa's core features and discover your first opportunities.",
    features: [
      "✔️ Unlimited search of public competitions and programs",
      "✔️ Smart filters and recommendations",
      "✔️ Access to basic team matching",
      "✔️ Community support forum",
      "✔️ Save favorite opportunities",
    ],
    cta: "Get Started",
  },
  {
    name: "Plus - Lifetime Access",
    price: 49.99,
    oldPrice: 99.99,
    priceId: "price_xxx_plus",
    description: "Unlock advanced analytics, premium matching, and exclusive resources.",
    features: [
      "✔️ All Starter features",
      "✔️ Advanced team matching & AI recommendations",
      "✔️ Access to premium competitions & programs",
      "✔️ Early access to new features",
      "✔️ Priority support",
    ],
    cta: "Upgrade to Plus",
  },
  {
    name: "Pro - Lifetime Access",
    price: 99.99,
    oldPrice: 199.99,
    priceId: "price_xxx_pro",
    description: "For power users: full access to Versa's ecosystem, integrations, and custom tools.",
    features: [
      "✔️ All Plus features",
      "✔️ Custom integrations (Slack, Notion, etc.)",
      "✔️ API access & automation tools",
      "✔️ Dedicated onboarding & support",
      "✔️ Invite-only community events",
    ],
    cta: "Go Pro",
  },
];

// Mock user subscription state
const mockUserSubscription = {
  plan: "Pro", // "Free", "Pro", or "Enterprise"
  stripeCustomerId: "cus_mock123",
  stripeSubscriptionId: "sub_mock123",
};

export default function PlansPage() {
  const [selected, setSelected] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  async function handleContinue() {
    const plan = plans[selected];
    if (plan.price === 0) {
      setShowSuccess(true);
    } else {
      // POST to /api/stripe/checkout
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start py-12 px-4 md:px-0">
      {/* Versa pill with icon */}
      <div className="flex justify-center mb-4">
        <span className={`inline-flex items-center text-sm md:text-base font-semibold text-white ${versaGradient} rounded-full px-4 py-1 tracking-wide`}>
          <Rocket className="w-4 h-4 mr-2" />
          One-Time Purchase, Lifetime Access
        </span>
      </div>
      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-extrabold text-black text-center mb-4">
        <span className={versaTextGradient}>Accelerate</span> Search. Boost <span className={versaTextGradient}>Success.</span>
      </h1>
      {/* Subtitle */}
      <p className="text-lg md:text-xl text-gray-600 text-center mb-10 max-w-2xl">
        Versa empowers students and teams to discover, connect, and win. Enjoy smart matching, curated opportunities, and a supportive community—built to help you reach your goals faster.
      </p>
      {/* Pricing Cards */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-stretch">
        {plans.map((plan, i) => (
          <div
            key={plan.name}
            className={`flex-1 bg-white rounded-2xl shadow-xl border p-8 flex flex-col items-center min-w-[280px] max-w-sm relative transition-all duration-200 ${i === 1 ? 'border-2 border-blue-500' : selected === i ? 'border-2 border-blue-500' : 'border-gray-100'}`}
          >
            {i === 1 && (
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-semibold px-4 py-1 rounded-full bg-blue-600 text-white shadow border-2 border-blue-500">Most Popular</span>
            )}
            <h2 className="text-lg font-semibold text-black mb-2">{plan.name}</h2>
            <p className="text-gray-500 text-sm mb-4 text-center">{plan.description}</p>
            <div className="mb-2 flex items-center gap-2">
              {plan.oldPrice && <span className="text-gray-400 line-through text-lg">${plan.oldPrice}</span>}
              <span className="text-2xl font-extrabold text-black">{plan.price === 0 ? "Free" : `$${plan.price}`}</span>
              {plan.price !== 0 && <span className="text-xs text-gray-400 font-semibold">USD</span>}
            </div>
            <ul className="text-left text-gray-700 text-sm space-y-2 mt-4 mb-2 w-full max-w-xs">
              {plan.features.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
            <button
              className={`mt-4 w-full py-2 rounded-lg font-semibold text-base transition-all duration-150 ${selected === i ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
              onClick={() => setSelected(i)}
            >
              {selected === i ? "Selected" : plan.cta}
            </button>
          </div>
        ))}
      </div>
      {/* Continue Button */}
      <div className="w-full flex justify-center mt-8">
        <Button
          className="w-full max-w-5xl py-4 rounded-lg font-semibold text-lg bg-black text-white hover:bg-gray-900 flex items-center justify-center gap-2"
          onClick={handleContinue}
        >
          Continue
          <ArrowRight className="h-5 w-5 text-blue-600" />
        </Button>
      </div>
      {/* Success Message for Free Plan */}
      {showSuccess && (
        <div className="mt-6 text-green-600 font-semibold text-center">You have successfully selected the free Starter plan!</div>
      )}
    </div>
  );
} 