"use client";
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-16 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {plans.map((plan) => {
          const isCurrent = userSub.plan === plan.name;
          return (
            <div key={plan.name} className={`rounded-2xl bg-white shadow-lg border border-gray-100 p-8 flex flex-col items-center ${isCurrent ? 'ring-2 ring-indigo-500' : ''}`}>
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="text-4xl font-extrabold mb-2">{plan.price === 0 ? "Free" : `$${plan.price}/mo`}</div>
              <div className="text-gray-500 mb-4 text-center">{plan.description}</div>
              <ul className="mb-6 space-y-2 w-full">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <Button className="w-full" disabled>Current Plan</Button>
              ) : plan.price === 0 ? (
                <Button className="w-full" disabled>Switch to Free</Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe(plan.stripePriceId)}
                  disabled={loading === plan.stripePriceId}
                >
                  {loading === plan.stripePriceId ? "Redirecting..." : "Subscribe"}
                </Button>
              )}
            </div>
          );
        })}
      </div>
      {userSub.plan !== "Free" && (
        <div className="mt-10">
          <Button
            variant="outline"
            className="px-8 py-3 text-base font-semibold"
            onClick={handleManageBilling}
            disabled={loading === "billing"}
          >
            {loading === "billing" ? "Loading..." : "Manage Billing"}
          </Button>
        </div>
      )}
    </div>
  );
} 