import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface RecommendedTeammate {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
  similarity: number;
}

interface RecommendedTeammatesModalProps {
  matches: RecommendedTeammate[];
  onClose: () => void;
}

export function RecommendedTeammatesModal({ matches, onClose }: RecommendedTeammatesModalProps) {
  if (!matches || matches.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-900">
          Recommended Teammates
        </h2>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 -mr-2">
          {matches.map((match) => (
            <Card key={match.user_id} className="flex items-center gap-4 p-3 shadow-sm hover:shadow-md transition-shadow">
              <Avatar className="h-10 w-10">
                <AvatarImage src={match.avatar_url} alt={`${match.first_name}'s avatar`} />
                <AvatarFallback className="bg-indigo-100 text-indigo-800">
                  {match.first_name?.[0]}{match.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {match.first_name} {match.last_name}
                </h3>
                {match.bio && (
                  <p className="text-xs text-gray-500 truncate">
                    {match.bio}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs bg-indigo-50 text-indigo-700 rounded-full px-2 py-1 font-medium">
                  {(match.similarity * 100).toFixed(0)}% match
                </span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="whitespace-nowrap"
                  onClick={() => {
                    // TODO: Implement message functionality
                    console.log(`Message ${match.first_name} ${match.last_name}`);
                  }}
                >
                  Message
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-6"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
