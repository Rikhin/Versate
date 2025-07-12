"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import Papa from 'papaparse';

// 1. Update OnboardingFormData to include new fields
interface OnboardingFormData {
  fullName: string;
  age: number | '';
  city: string;
  educationLevel: string;
  interests: string[];
}

function CityDropdown({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [cities, setCities] = useState<{ city: string, state_id: string }[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/uscities.csv')
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true });
        setCities(parsed.data.map((row: unknown) => ({ city: (row as { city: string, state_id: string }).city, state_id: (row as { city: string, state_id: string }).state_id })).filter((row: unknown) => (row as { city: string, state_id: string }).city && (row as { city: string, state_id: string }).state_id));
        setLoading(false);
      });
  }, []);

  const filtered = cities.filter(({ city, state_id }) =>
    `${city}, ${state_id}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <Input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Type city, ST..."
        aria-label="Type city, ST (e.g., San Jose, CA)"
        className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4 mb-2"
      />
      <span className="sr-only">Type city, ST (e.g., San Jose, CA)</span>
      <div className="max-h-40 overflow-y-auto border rounded-xl bg-white shadow-md">
        {loading ? (
          <div className="p-2 text-gray-500">Loading cities...</div>
        ) : filtered.length === 0 ? (
          <div className="p-2 text-gray-500">No results</div>
        ) : (
          filtered.slice(0, 10).map(({ city, state_id }) => {
            const label = `${city}, ${state_id}`;
            return (
              <div
                key={label}
                className={`p-2 cursor-pointer hover:bg-indigo-100 ${label === value ? 'bg-indigo-200 font-bold' : ''}`}
                onClick={() => { onChange(label); setSearch(label); }}
              >
                {label}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const educationOptions = [
  'Middle School (Grades 6-8)',
  'High School (Grades 9-12)',
  'Undergraduate',
  'Graduate',
  'Post-Graduate',
  'Other',
];

export function OnboardingForm() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<OnboardingFormData>({
    fullName: '',
    age: '',
    city: '',
    educationLevel: '',
    interests: [],
  });
  const [interestInput, setInterestInput] = useState('');
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

  // Slide content
  const slides = [
    // Slide 1: Welcome
    <div key="slide1" className="flex flex-col items-center justify-center min-h-[300px] animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Welcome to Versate!</h1>
      <p className="text-gray-500 mb-8 text-center max-w-xs">Let&apos;s get to know you. This quick questionnaire will personalize your experience.</p>
      <Button className="w-40 h-12 text-lg shadow-md" onClick={() => setCurrentStep(2)}>Let&apos;s Begin</Button>
    </div>,
    // Slide 2: Basic Info
    <div key="slide2" className="flex flex-col gap-6 min-h-[300px] animate-fade-in">
      <div>
        <Label htmlFor="fullName" className="block mb-2">Full Name</Label>
        <Input id="fullName" type="text" value={formData.fullName} onChange={e => setFormData(f => ({ ...f, fullName: e.target.value }))} required className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4" />
      </div>
      <div>
        <Label htmlFor="age" className="block mb-2">Age</Label>
        <Input id="age" type="number" min={13} max={100} value={formData.age} onChange={e => setFormData(f => ({ ...f, age: e.target.value === '' ? '' : Math.max(13, Math.min(100, Number(e.target.value))) }))} required className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4" />
      </div>
    </div>,
    // Slide 3: Location
    <div key="slide3" className="flex flex-col gap-6 min-h-[300px] animate-fade-in">
      <Label htmlFor="city" className="block mb-2">City</Label>
      <CityDropdown value={formData.city} onChange={val => setFormData(f => ({ ...f, city: val }))} />
    </div>,
    // Slide 4: Education
    <div key="slide4" className="flex flex-col gap-6 min-h-[300px] animate-fade-in">
      <Label htmlFor="educationLevel" className="block mb-2">Education Level</Label>
      <Select value={formData.educationLevel} onValueChange={val => setFormData(f => ({ ...f, educationLevel: val }))}>
        <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4">
          <SelectValue placeholder="Select education level" />
        </SelectTrigger>
        <SelectContent>
          {educationOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>,
    // Slide 5: Interests
    <div key="slide5" className="flex flex-col gap-6 min-h-[300px] animate-fade-in">
      <Label htmlFor="interests" className="block mb-2">Interests</Label>
      <Input
        id="interests"
        type="text"
        value={interestInput}
        onChange={e => setInterestInput(e.target.value)}
        onKeyDown={e => {
          if ((e.key === 'Enter' || e.key === ',') && interestInput.trim()) {
            e.preventDefault();
            const tags = interestInput.split(',').map(t => t.trim()).filter(Boolean);
            setFormData(f => ({ ...f, interests: Array.from(new Set([...f.interests, ...tags])) }));
            setInterestInput('');
          }
        }}
        placeholder="Photography, Reading, Travel..."
        className="h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl px-4"
      />
      <div className="flex flex-wrap gap-2">
        {formData.interests.map(tag => (
          <span key={tag} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full shadow-sm text-sm flex items-center gap-1">
            {tag}
            <button type="button" className="ml-1 text-gray-400 hover:text-red-500" onClick={() => setFormData(f => ({ ...f, interests: f.interests.filter(t => t !== tag) }))}>&times;</button>
          </span>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">Separate interests with commas</p>
    </div>,
  ];

  // Navigation
  const handleNext = () => {
    if (currentStep < totalSteps && isStepValid()) setCurrentStep(s => s + 1);
    if (currentStep === totalSteps && isStepValid()) handleSubmit();
  };
  const handleBack = () => { if (currentStep > 1) setCurrentStep(s => s - 1); };

  // Submit handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
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
        setError(err.error || "Failed to save profile");
      }
    } catch {
      setError("Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress bar
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-2">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 relative animate-fade-in">
        <div className="absolute top-4 right-4 text-xs text-gray-400">{currentStep}/{totalSteps}</div>
        <div className="mb-6">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-2 bg-indigo-300 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {slides[currentStep - 1]}
        <div className="flex justify-between mt-8">
          <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1}>Back</Button>
          <Button onClick={handleNext} disabled={!isStepValid() || isSubmitting} className="ml-2">
            {currentStep === totalSteps ? (isSubmitting ? 'Saving...' : 'Finish') : 'Next'}
          </Button>
        </div>
        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
      </div>
    </div>
  );
} 