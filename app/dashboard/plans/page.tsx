"use client";
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Basic features for individuals",
    features: ["1 project", "Basic support", "Community access"],
    stripePriceId: null, // Free plan
  },
  {
    name: "Pro",
    price: 12,
    description: "Advanced features for power users",
    features: ["Unlimited projects", "Priority support", "Team collaboration", "Advanced analytics"],
    stripePriceId: "price_1ProMockID",
  },
  {
    name: "Enterprise",
    price: 49,
    description: "Best for organizations and schools",
    features: ["Custom integrations", "Dedicated support", "Admin tools", "SAML SSO"],
    stripePriceId: "price_1EnterpriseMockID",
  },
];

// Mock user subscription state
const mockUserSubscription = {
  plan: "Pro", // "Free", "Pro", or "Enterprise"
  stripeCustomerId: "cus_mock123",
  stripeSubscriptionId: "sub_mock123",
};

export default function PlansPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [userSub, setUserSub] = useState(mockUserSubscription);

  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) return; // Free plan
    setLoading(priceId);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Error creating checkout session");
    }
    setLoading(null);
  };

  const handleManageBilling = async () => {
    setLoading("billing");
    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: userSub.stripeCustomerId }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Error opening billing portal");
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start py-12 px-4 md:px-0">
      {/* Orange badge */}
      <div className="flex justify-center mb-4">
        <span className="inline-block text-sm md:text-base font-semibold text-orange-500 bg-orange-100 rounded-full px-4 py-1 tracking-wide">One-Time Purchase, Lifetime Access</span>
      </div>
      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-black text-black text-center mb-4">Skip Months of Research</h1>
      {/* Subtitle */}
      <p className="text-lg md:text-xl text-gray-500 text-center mb-10 max-w-2xl">
        Get instant access to validated business opportunities and market insights. Start finding your next big idea today.
      </p>
      {/* Pricing Cards */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-stretch">
        {/* Lite Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center min-w-[280px] max-w-sm">
          <h2 className="text-xl font-bold text-black mb-2">Lite - Lifetime Access</h2>
          <p className="text-gray-500 text-sm mb-4 text-center">Lifetime access to our continuously updating database of pain points and SaaS ideas</p>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-gray-400 line-through text-lg">$99.99</span>
            <span className="text-3xl font-black text-black">$49.99</span>
            <span className="text-xs text-gray-400 font-semibold">USD</span>
          </div>
          <ul className="text-left text-gray-700 text-sm space-y-2 mt-4 mb-2 w-full max-w-xs">
            <li>✔️ Database updates with fresh market insights</li>
            <li>✔️ Limited to 10 queries per day</li>
            <li>✔️ Access to G2 and Upwork Analysis Database</li>
            <li>✔️ Access to database of 3000+ Products</li>
            <li>✔️ Access to curated SaaS Solutions database</li>
            <li>✔️ Access to curated Pain Points database</li>
          </ul>
        </div>
        {/* Basic Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border-2 border-orange-400 p-8 flex flex-col items-center min-w-[280px] max-w-sm relative">
          {/* Most Popular Badge */}
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md tracking-wide">MOST POPULAR</span>
          <h2 className="text-xl font-bold text-black mb-2">Basic - Lifetime Access</h2>
          <p className="text-gray-500 text-sm mb-4 text-center">Lifetime access to our continuously updating databases and Micro SaaS Boilerplate</p>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-gray-400 line-through text-lg">$149.99</span>
            <span className="text-3xl font-black text-black">$99.99</span>
            <span className="text-xs text-gray-400 font-semibold">USD</span>
          </div>
          <ul className="text-left text-gray-700 text-sm space-y-2 mt-4 mb-2 w-full max-w-xs">
            <li>✔️ Database updates with fresh market insights</li>
            <li>✔️ Access to Micro SaaS BoilerPlate ✨</li>
            <li>✔️ Limited to 20 queries per day</li>
            <li>✔️ Access to G2 and Upwork Analysis Database</li>
            <li>✔️ Access to database of 3000+ Products</li>
            <li>✔️ Access to curated SaaS Solutions database</li>
            <li>✔️ Access to curated Pain Points database</li>
          </ul>
        </div>
        {/* Pro Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center min-w-[280px] max-w-sm">
          <h2 className="text-xl font-bold text-black mb-2">Pro - Lifetime Access</h2>
          <p className="text-gray-500 text-sm mb-4 text-center">Everything in Basic + Create custom AI agent pipelines to automatically extract pain points and generate SaaS ideas from any subreddit. Access every database and feature.</p>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-gray-400 line-through text-lg">$299.99</span>
            <span className="text-3xl font-black text-black">$199.99</span>
            <span className="text-xs text-gray-400 font-semibold">USD</span>
          </div>
          <ul className="text-left text-gray-700 text-sm space-y-2 mt-4 mb-2 w-full max-w-xs">
            <li>✔️ Database updates with fresh market insights</li>
            <li>✔️ Access to Micro SaaS BoilerPlate ✨</li>
            <li>✔️ Unlimited queries</li>
            <li>✔️ Access to G2 and Upwork Analysis Database</li>
            <li>✔️ Access to database of 3000+ Products</li>
            <li>✔️ Access to curated SaaS Solutions database</li>
            <li>✔️ Access to curated Pain Points database</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 