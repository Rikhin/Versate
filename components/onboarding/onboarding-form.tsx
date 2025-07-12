"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// 1. Update OnboardingFormData to include new fields
interface OnboardingFormData {
  fullName: string;
  age: number | '';
  city: string;
  educationLevel: string;
  interests: string[];
}

export function OnboardingForm() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    fullName: '',
    age: '',
    city: '',
    educationLevel: '',
    interests: [],
  });
  const totalSteps = 5;

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('onboarding-progress', JSON.stringify({ formData, currentStep }));
  }, [formData, currentStep]);
  useEffect(() => {
    const saved = localStorage.getItem('onboarding-progress');
    if (saved) {
      const { formData: savedData, currentStep: savedStep } = JSON.parse(saved);
      setFormData(savedData);
      setCurrentStep(savedStep);
    }
  }, []);

  if (!isLoaded || !user) return <div>Loading...</div>;

  // Slide validation
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return formData.fullName.trim().length > 0 && Number(formData.age) >= 13 && Number(formData.age) <= 100;
      case 3:
        return formData.city.trim().length > 0;
      case 4:
        return formData.educationLevel.trim().length > 0;
      case 5:
        return formData.interests.length > 0;
      default:
        return false;
    }
  };

  // Navigation
  const handleNext = () => {
    if (currentStep < totalSteps && isStepValid()) setCurrentStep(s => s + 1);
    if (currentStep === totalSteps && isStepValid()) handleSubmit();
  };

  // Submit handler
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          full_name: formData.fullName,
          age: formData.age,
          city: formData.city,
          education_level: formData.educationLevel,
          interests: formData.interests,
          email: user.emailAddresses?.[0]?.emailAddress || '',
        }),
      });
      if (response.ok) router.push("/dashboard");
      else {
        const err = await response.json();
        alert(err.error || "Failed to save profile");
      }
    } catch {
      alert("Failed to save profile");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafbfc]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 flex flex-col gap-10 transition-all duration-300">
        {/* Progress bar */}
        <div className="flex items-center mb-6">
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden mr-2">
            <div className="h-1 bg-black rounded-full transition-all duration-300" style={{ width: `${(currentStep-1)/4*100}%` }} />
          </div>
          <span className="text-xs text-gray-400">{currentStep}/5</span>
        </div>
        {/* Slide content */}
        <div className="min-h-[220px] flex flex-col justify-center gap-8 transition-all duration-300">
          {currentStep === 1 && (
            <div className="flex flex-col items-center gap-6 animate-fadein">
              <h1 className="text-2xl font-semibold text-black">Welcome to Versate!</h1>
              <p className="text-gray-500 text-center max-w-xs">Let&apos;s get to know you. This quick questionnaire will personalize your experience.</p>
              <button className="mt-6 px-8 py-3 border border-black text-black rounded-lg font-medium bg-white hover:bg-gray-50 transition" onClick={() => setCurrentStep(2)}>Let&apos;s Begin</button>
            </div>
          )}
          {currentStep === 2 && (
            <div className="flex flex-col gap-8 animate-fadein">
              <div className="flex flex-col gap-6">
                <label className="text-black font-medium">Full Name
                  <input
                    type="text"
                    className="mt-2 w-full px-4 py-3 border border-black rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </label>
                <label className="text-black font-medium">Age
                  <input
                    type="number"
                    min={13}
                    max={100}
                    className="mt-2 w-full px-4 py-3 border border-black rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition"
                    placeholder="Your age"
                    value={formData.age}
                    onChange={e => {
                      const val = e.target.value;
                      setFormData({ ...formData, age: val === '' ? '' : Number(val) });
                    }}
                    required
                  />
                </label>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button className="text-black border border-black rounded-lg px-6 py-2 bg-white hover:bg-gray-50 transition" onClick={() => setCurrentStep(1)}>Back</button>
                <button className="text-black border border-black rounded-lg px-6 py-2 bg-white hover:bg-gray-50 transition disabled:opacity-40" onClick={handleNext} disabled={!formData.fullName || !formData.age}>Next</button>
              </div>
            </div>
          )}
          {/* Repeat similar minimalist, airy, black-and-white styling for steps 3, 4, 5 */}
        </div>
      </div>
    </div>
  );
} 