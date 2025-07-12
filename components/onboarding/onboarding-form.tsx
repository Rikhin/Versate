"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Papa from "papaparse";

// 1. Update OnboardingFormData to include new fields
interface OnboardingFormData {
  firstName: string;
  lastName: string;
  age: number | '';
  city: string;
  educationLevel: string;
  educationDetail: string;
  interests: string[];
}

export function OnboardingForm() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    age: '',
    city: '',
    educationLevel: '',
    educationDetail: '',
    interests: [],
  });
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
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

  // City autocomplete loader
  useEffect(() => {
    fetch('/uscities.csv')
      .then(res => res.text())
      .then(text => {
        const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });
        setCityOptions(
          (data as Array<Record<string, string>>)
            .map(row => `${row.city}, ${row.state_name}`)
            .filter(Boolean)
        );
      });
  }, []);

  if (!isLoaded || !user) return <div>Loading...</div>;

  // Slide validation
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return formData.firstName.trim().length > 0 && formData.lastName.trim().length > 0 && Number(formData.age) >= 13 && Number(formData.age) <= 100;
      case 3:
        return formData.city.trim().length > 0;
      case 4:
        if (formData.educationLevel === 'Middle School' || formData.educationLevel === 'High School' || formData.educationLevel === 'Undergraduate' || formData.educationLevel === 'Graduate') {
          return formData.educationLevel.trim().length > 0 && formData.educationDetail.trim().length > 0;
        }
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
          first_name: formData.firstName,
          last_name: formData.lastName,
          age: formData.age,
          city: formData.city,
          education_level: formData.educationLevel,
          education_detail: formData.educationDetail,
          interests: formData.interests,
          email: user.emailAddresses?.[0]?.emailAddress || '',
        }),
      });
      if (response.ok) router.push("/dashboard");
      else {
        let errMsg = "Failed to save profile";
        try {
          const err = await response.json();
          errMsg = err.error || errMsg;
        } catch {
          try {
            errMsg = await response.text();
          } catch {}
        }
        console.error("Profile save error:", errMsg);
        alert(errMsg);
      }
    } catch {
      alert("Failed to save profile");
    }
  };

  // Replace the outer container and slide wrappers with a full-screen, flex-centered layout
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-white px-4">
      <div className="w-full max-w-lg flex flex-col gap-12">
        {/* Versate logo and name above progress bar for steps 2-5 */}
        {currentStep > 1 && (
          <div className="flex justify-center mb-2 w-full">
            <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Versate
            </span>
          </div>
        )}
        {/* Progress bar */}
        <div className="w-full flex items-center mb-8">
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden mr-2">
            <div className="h-1 bg-black rounded-full transition-all duration-300" style={{ width: `${(currentStep-1)/4*100}%` }} />
          </div>
          <span className="text-sm text-gray-400 font-medium">{currentStep}/5</span>
              </div>
        {/* Slide content */}
        <div className="w-full flex flex-col gap-10 animate-fadein">
          {currentStep === 1 && (
            <div className="flex flex-col items-center gap-8">
              <h1 className="text-3xl font-bold text-black tracking-tight">Welcome to Versate!</h1>
              <p className="text-gray-500 text-center max-w-md text-lg">Let&apos;s get to know you. This quick questionnaire will personalize your experience.</p>
              <button className="mt-6 px-10 py-3 border border-black text-black rounded-lg font-semibold bg-white hover:bg-gray-100 transition text-lg" onClick={() => setCurrentStep(2)}>Let&apos;s Begin</button>
            </div>
          )}
          {currentStep === 2 && (
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-8">
                <div className="flex gap-4">
                  <label className="flex-1 text-black font-semibold text-lg">First Name
                    <input
                      type="text"
                      className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </label>
                  <label className="flex-1 text-black font-semibold text-lg">Last Name
                    <input
                      type="text"
                      className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </label>
                </div>
                <label className="text-black font-semibold text-lg">Age
                  <input
                    type="number"
                    min={13}
                    max={100}
                    className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                    placeholder="Your age"
                    value={formData.age}
                    onChange={e => {
                      const val = e.target.value;
                      setFormData({ ...formData, age: val === '' ? '' : Number(val) });
                    }}
                    required
                  />
                  <span className="text-xs text-gray-400 mt-1 block">Age must be between 13 and 100</span>
                </label>
              </div>
              <div className="flex justify-between items-center mt-2">
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg" onClick={() => setCurrentStep(1)}>Back</button>
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg disabled:opacity-40" onClick={handleNext} disabled={!formData.firstName || !formData.lastName || !formData.age}>Next</button>
              </div>
            </div>
          )}
          {/* Repeat similar minimalist, full-width, spaced-out styling for steps 3, 4, 5 */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-8">
                <label className="text-black font-semibold text-lg">City
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                      placeholder="Start typing your city..."
                      value={cityInput}
                      onChange={e => {
                        setCityInput(e.target.value);
                        setShowCityDropdown(true);
                        setFormData({ ...formData, city: e.target.value });
                      }}
                      onFocus={() => setShowCityDropdown(true)}
                      onBlur={() => setTimeout(() => setShowCityDropdown(false), 100)}
                      required
                      autoComplete="off"
                    />
                    {showCityDropdown && cityInput && (
                      <div className="absolute left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-56 overflow-y-auto" style={{width: '100%'}}>
                        {cityOptions.filter(opt => opt.toLowerCase().includes(cityInput.toLowerCase())).slice(0, 8).map((opt, idx) => (
                          <div
                            key={idx}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                            onMouseDown={() => {
                              setFormData({ ...formData, city: opt });
                              setCityInput(opt);
                              setShowCityDropdown(false);
                            }}
                          >
                            {opt}
                      </div>
                        ))}
                        {cityOptions.filter(opt => opt.toLowerCase().includes(cityInput.toLowerCase())).length === 0 && (
                          <div className="px-4 py-2 text-gray-400">No matches found</div>
                        )}
                      </div>
                    )}
                        </div>
                </label>
                        </div>
              <div className="flex justify-between items-center mt-2">
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg" onClick={() => setCurrentStep(2)}>Back</button>
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg disabled:opacity-40" onClick={handleNext} disabled={!formData.city}>Next</button>
                      </div>
                    </div>
                  )}
          {currentStep === 4 && (
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-8">
                <label className="text-black font-semibold text-lg">Education Level
                  <select
                    className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                    value={formData.educationLevel}
                    onChange={e => setFormData({ ...formData, educationLevel: e.target.value, educationDetail: '' })}
                    required
                  >
                    <option value="">Select your education level</option>
                    <option value="Middle School">Middle School</option>
                    <option value="High School">High School</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                {/* Conditional grade/year dropdown */}
                {formData.educationLevel === 'Middle School' && (
                  <label className="text-black font-semibold text-lg">Grade
                    <select
                      className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                      value={formData.educationDetail}
                      onChange={e => setFormData({ ...formData, educationDetail: e.target.value })}
                      required
                    >
                      <option value="">Select grade</option>
                      <option value="6">6th Grade</option>
                      <option value="7">7th Grade</option>
                      <option value="8">8th Grade</option>
                    </select>
                  </label>
                )}
                {formData.educationLevel === 'High School' && (
                  <label className="text-black font-semibold text-lg">Grade
                    <select
                      className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                      value={formData.educationDetail}
                      onChange={e => setFormData({ ...formData, educationDetail: e.target.value })}
                      required
                    >
                      <option value="">Select grade</option>
                      <option value="9">9th Grade (Freshman)</option>
                      <option value="10">10th Grade (Sophomore)</option>
                      <option value="11">11th Grade (Junior)</option>
                      <option value="12">12th Grade (Senior)</option>
                    </select>
                  </label>
                )}
                {formData.educationLevel === 'Undergraduate' && (
                  <label className="text-black font-semibold text-lg">Year
                    <select
                      className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                      value={formData.educationDetail}
                      onChange={e => setFormData({ ...formData, educationDetail: e.target.value })}
                      required
                    >
                      <option value="">Select year</option>
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </label>
                )}
                {formData.educationLevel === 'Graduate' && (
                  <label className="text-black font-semibold text-lg">Year
                    <select
                      className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                      value={formData.educationDetail}
                      onChange={e => setFormData({ ...formData, educationDetail: e.target.value })}
                      required
                    >
                      <option value="">Select year</option>
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th+">4th Year or above</option>
                    </select>
                  </label>
                )}
                        </div>
              <div className="flex justify-between items-center mt-2">
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg" onClick={() => setCurrentStep(3)}>Back</button>
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg disabled:opacity-40" onClick={handleNext} disabled={!formData.educationLevel || ((formData.educationLevel === 'Middle School' || formData.educationLevel === 'High School' || formData.educationLevel === 'Undergraduate' || formData.educationLevel === 'Graduate') && !formData.educationDetail)}>Next</button>
                    </div>
                  </div>
                )}
          {currentStep === 5 && (
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-8">
                <label className="text-black font-semibold text-lg">Interests
                  <input
                    type="text"
                    className="mt-3 w-full px-5 py-4 border border-black rounded-xl bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition text-lg"
                    placeholder="Type an interest and press Enter"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !formData.interests.includes(value)) {
                          setFormData({ ...formData, interests: [...formData.interests, value] });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.interests.map((interest, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-200 text-black rounded-full text-sm flex items-center gap-1">
                        {interest}
                        <button type="button" className="ml-1 text-gray-500 hover:text-black" onClick={() => setFormData({ ...formData, interests: formData.interests.filter((_, i) => i !== idx) })}>&times;</button>
                      </span>
                    ))}
                  </div>
                </label>
              </div>
              <div className="flex justify-between items-center mt-2">
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg" onClick={() => setCurrentStep(4)}>Back</button>
                <button className="text-black border border-black rounded-lg px-8 py-3 bg-white hover:bg-gray-100 transition text-lg disabled:opacity-40" onClick={handleNext} disabled={formData.interests.length === 0}>Finish</button>
                  </div>
                </div>
          )}
                </div>
      </div>
    </div>
  );
} 