'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Search, Trophy, Users, UserCheck, Target } from "lucide-react";
import { competitions } from '@/lib/competitions-data';
import { useRouter } from "next/navigation";

interface CompetitionInterest {
  competitionId: string;
  interest: 'competing' | 'looking_for_partner' | 'looking_for_mentor';
}

export default function CompetitionSelectionContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompetitions, setSelectedCompetitions] = useState<{ [key: string]: CompetitionInterest[] }>({});

  const filteredCompetitions = competitions.filter(comp =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCompetitionToggle = (competitionId: string, interest: 'competing' | 'looking_for_partner' | 'looking_for_mentor', checked: boolean) => {
    setSelectedCompetitions(prev => {
      const current = prev[competitionId] || [];
      let updated;
      
      if (checked) {
        updated = [...current, { competitionId, interest }];
      } else {
        updated = current.filter(c => !(c.competitionId === competitionId && c.interest === interest));
      }
      
      return {
        ...prev,
        [competitionId]: updated
      };
    });
  };

  const isChecked = (competitionId: string, interest: string) => {
    return selectedCompetitions[competitionId]?.some(c => c.interest === interest) || false;
  };

  const getSelectedCount = (competitionId: string) => {
    return selectedCompetitions[competitionId]?.length || 0;
  };

  const saveSelections = async () => {
    try {
      const competitionsArray = Object.values(selectedCompetitions).flat();
      
      const response = await fetch("/api/profiles/competitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          competitions: competitionsArray,
        }),
      });

      if (response.ok) {
        alert("Competition interests saved successfully!");
        router.push("/dashboard");
      } else {
        throw new Error("Failed to save competition interests");
      }
    } catch (error) {
      console.error("Error saving competition interests:", error);
      alert("Failed to save competition interests. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/60 to-indigo-100/60 dark:from-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your <span className="text-indigo-600">Competitions</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search for competitions and let us know what you&apos;re interested in
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search competitions by name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base border-2 border-gray-200 focus:border-indigo-400 rounded-xl"
            />
          </div>
        </div>

        {/* Competition Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCompetitions.map((competition) => (
            <Card key={competition.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{competition.icon}</span>
                    <CardTitle className="text-lg font-semibold">{competition.name}</CardTitle>
                  </div>
                  {getSelectedCount(competition.id) > 0 && (
                    <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                      {getSelectedCount(competition.id)} selected
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{competition.category}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700 line-clamp-3">{competition.description}</p>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">What are you interested in?</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${competition.id}-competing`}
                        checked={isChecked(competition.id, 'competing')}
                        onCheckedChange={(checked) => 
                          handleCompetitionToggle(competition.id, 'competing', checked as boolean)
                        }
                        className="border-2 border-gray-200 data-[state=checked]:border-indigo-500"
                      />
                      <Label 
                        htmlFor={`${competition.id}-competing`} 
                        className="text-sm font-normal cursor-pointer flex items-center space-x-1"
                      >
                        <Target className="h-4 w-4" />
                        <span>Competing</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${competition.id}-partner`}
                        checked={isChecked(competition.id, 'looking_for_partner')}
                        onCheckedChange={(checked) => 
                          handleCompetitionToggle(competition.id, 'looking_for_partner', checked as boolean)
                        }
                        className="border-2 border-gray-200 data-[state=checked]:border-indigo-500"
                      />
                      <Label 
                        htmlFor={`${competition.id}-partner`} 
                        className="text-sm font-normal cursor-pointer flex items-center space-x-1"
                      >
                        <Users className="h-4 w-4" />
                        <span>Need Partner</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${competition.id}-mentor`}
                        checked={isChecked(competition.id, 'looking_for_mentor')}
                        onCheckedChange={(checked) => 
                          handleCompetitionToggle(competition.id, 'looking_for_mentor', checked as boolean)
                        }
                        className="border-2 border-gray-200 data-[state=checked]:border-indigo-500"
                      />
                      <Label 
                        htmlFor={`${competition.id}-mentor`} 
                        className="text-sm font-normal cursor-pointer flex items-center space-x-1"
                      >
                        <UserCheck className="h-4 w-4" />
                        <span>Need Mentor</span>
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Deadline: {new Date(competition.deadline).toLocaleDateString()}</span>
                    <span>{competition.participants}/{competition.maxParticipants} participants</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Save Button */}
        <div className="text-center">
          <Button 
            onClick={saveSelections}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-base font-medium"
          >
            Save Competition Interests
          </Button>
        </div>

        {/* No Results */}
        {filteredCompetitions.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No competitions found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all competitions</p>
          </div>
        )}
      </div>
    </div>
  );
} 