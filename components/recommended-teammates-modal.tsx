import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function RecommendedTeammatesModal({ matches, onClose }: { matches: any[], onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl">×</button>
        <h2 className="text-xl font-semibold mb-4 text-center">Recommended Teammates</h2>
        <div className="space-y-4">
          {matches.map((m, i) => (
            <Card key={m.user_id} className="flex items-center gap-4 p-3 shadow-none border-gray-100">
              <Avatar>
                <AvatarImage src={m.avatar_url} alt={m.first_name} />
                <AvatarFallback>{m.first_name?.[0]}{m.last_name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{m.first_name} {m.last_name}</div>
                <div className="text-xs text-gray-500 truncate max-w-xs">{m.bio}</div>
              </div>
              <span className="text-xs bg-gray-100 rounded-full px-2 py-1 font-mono text-gray-600">{(m.similarity * 100).toFixed(0)}%</span>
              <Button size="sm" variant="outline" className="ml-2">Message</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 