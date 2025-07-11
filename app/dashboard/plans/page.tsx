"use client";
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { BackgroundGradient, FloatingShapes } from "@/components/scroll-animations";

interface Plan {
  name: string;
  price: number;
  oldPrice: number | null;
  priceId: string | null;
  description: string;
  features: string[];
  cta: string;
}

const plans: Plan[] = [
  {
    name: "Starter - Free",
    price: 0,
    oldPrice: null,
    priceId: null,
    description: "Get started with Versate's core features and discover your first opportunities.",
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
    description: "For power users: full access to Versate's ecosystem, integrations, and custom tools.",
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

export default function PlansPage() {
  const [selected, setSelected] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

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
      const data: { url?: string; error?: string } = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    }
  }

  return (
    <div className="min-h-screen bg-helix-dark relative overflow-hidden flex flex-col items-center justify-start py-20 px-6 lg:px-8">
      <BackgroundGradient startColor="from-helix-blue/20" endColor="to-helix-dark-blue/20" triggerStart="top center" triggerEnd="center center" />
      <FloatingShapes count={3} triggerStart="top center" triggerEnd="bottom center" />
      <div className="relative z-10 w-full max-w-7xl">
        <h1 className="text-3xl md:text-5xl font-semibold text-white text-center mb-6 leading-tight">
          <span className="gradient-text-helix">Accelerate</span> Search.<br />Boost <span className="gradient-text-helix">Success.</span>
        </h1>
        <p className="text-base md:text-lg text-helix-text-light text-center mb-10 max-w-3xl mx-auto leading-relaxed">
          Versate empowers students and teams to discover, connect, and win. Enjoy smart matching, curated opportunities, and a supportive community built to help you reach your goals faster.
        </p>
        {plans.length === 0 ? (
          <div className="text-center text-white/70 py-12">No plans available at this time. Please check back later.</div>
        ) : (
          <div className="w-full flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-stretch mb-12">
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`flex-1 glass border border-white/10 rounded-[24px] shadow-xl p-8 flex flex-col items-center min-w-[280px] max-w-sm relative transition-all duration-300 ${i === 1 ? 'border-2 border-helix-gradient-start glow' : selected === i ? 'border-2 border-helix-gradient-start glow' : 'hover:glow'}`}
              >
                {i === 1 && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold px-6 py-2 rounded-full bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white shadow-xl glow">Most Popular</span>
                )}
                <h2 className="text-xl font-medium text-white mb-3">{plan.name}</h2>
                <p className="text-helix-text-light text-sm mb-5 text-center leading-relaxed">{plan.description}</p>
                <div className="mb-5 flex items-center gap-2">
                  {plan.oldPrice && <span className="text-helix-text-light line-through text-base">${plan.oldPrice}</span>}
                  <span className="text-2xl font-semibold text-white">{plan.price === 0 ? "Free" : `$${plan.price}`}</span>
                  {plan.price !== 0 && <span className="text-xs text-helix-text-light font-medium">USD</span>}
                </div>
                <ul className="text-left text-helix-text-light text-sm space-y-2 mt-4 mb-6 w-full max-w-xs">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-helix-gradient-start mt-0.5 flex-shrink-0" />
                      <span>{f.replace('\u2714\ufe0f ', '')}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-auto w-full py-3 rounded-md font-medium text-base transition-all duration-300 ${selected === i ? 'bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white shadow-xl glow' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'}`}
                  onClick={() => setSelected(i)}
                >
                  {selected === i ? "Selected" : plan.cta}
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="w-full flex justify-center">
          <Button
            className="w-full max-w-5xl py-4 rounded-md font-semibold text-lg bg-gradient-to-r from-helix-gradient-start to-helix-gradient-end text-white hover:shadow-xl glow flex items-center justify-center gap-2"
            onClick={handleContinue}
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        {showSuccess && (
          <div className="mt-6 text-green-400 font-medium text-center text-base">You have successfully selected the free Starter plan!</div>
        )}
      </div>
    </div>
  );
} 