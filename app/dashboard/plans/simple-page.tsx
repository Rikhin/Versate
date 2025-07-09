"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function SimplePlansPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Starter - Free</h2>
            <div className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal text-gray-500">/month</span></div>
            <p className="text-gray-600 mb-4">Get started with our core features</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Basic features
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Community support
              </li>
            </ul>
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Basic Plan */}
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-500 transform scale-105">
            <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-4">POPULAR</div>
            <h2 className="text-xl font-semibold mb-4">Plus</h2>
            <div className="text-3xl font-bold mb-4">$9.99<span className="text-sm font-normal text-gray-500">/month</span></div>
            <p className="text-gray-600 mb-4">Perfect for growing teams</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                All Free features
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Priority support
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Advanced analytics
              </li>
            </ul>
            <button 
              onClick={() => window.location.href = 'https://buy.stripe.com/test_28o2bQ4pJc6d3Uc000'}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Choose Plus
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Pro</h2>
            <div className="text-3xl font-bold mb-4">$19.99<span className="text-sm font-normal text-gray-500">/month</span></div>
            <p className="text-gray-600 mb-4">For power users</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                All Plus features
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                24/7 support
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Custom integrations
              </li>
            </ul>
            <button 
              onClick={() => window.location.href = 'https://buy.stripe.com/test_28o2bQ4pJc6d3Uc000'}
              className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition-colors"
            >
              Go Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
