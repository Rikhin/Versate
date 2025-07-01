import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_EMBED_URL = "https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedText?key=";

function cosineSimilarity(a: number[], b: number[]) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
}

async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch(GEMINI_EMBED_URL + GEMINI_API_KEY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error("Gemini embedding failed");
  const data = await res.json();
  return data.embedding.values;
}

function profileToText(profile: any): string {
  return [
    profile.first_name,
    profile.last_name,
    profile.bio,
    (profile.skills || []).join(", "),
    (profile.roles || []).join(", "),
    profile.experience_level,
    profile.time_commitment,
    (profile.collaboration_style || []).join(", "),
    profile.location,
    (profile.competitions || []).map((c: any) => c.competitionId + ':' + c.interest).join(", ")
  ].filter(Boolean).join(" | ");
}

export async function POST(req: NextRequest) {
  try {
    // Get user from Clerk (or from request body for testing)
    const { userId } = (await req.json()) || {};
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const supabase = createServerClient();
    // Fetch all profiles
    const { data: profiles, error } = await supabase.from("profiles").select("*");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const current = profiles.find((p: any) => p.user_id === userId);
    if (!current) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // Get/generate embedding for current user
    let currentEmbedding = current.profile_embedding;
    if (!currentEmbedding) {
      const text = profileToText(current);
      currentEmbedding = await getEmbedding(text);
      await supabase.from("profiles").update({ profile_embedding: currentEmbedding }).eq("user_id", userId);
    }

    // Get/generate embeddings for all others
    const others = profiles.filter((p: any) => p.user_id !== userId);
    for (const p of others) {
      if (!p.profile_embedding) {
        const text = profileToText(p);
        const emb = await getEmbedding(text);
        p.profile_embedding = emb;
        await supabase.from("profiles").update({ profile_embedding: emb }).eq("user_id", p.user_id);
      }
    }

    // Compute similarity
    const matches = others.map((p: any) => ({
      user_id: p.user_id,
      first_name: p.first_name,
      last_name: p.last_name,
      bio: p.bio,
      skills: p.skills,
      roles: p.roles,
      experience_level: p.experience_level,
      location: p.location,
      avatar_url: p.avatar_url,
      similarity: cosineSimilarity(currentEmbedding, p.profile_embedding)
    }));
    matches.sort((a, b) => b.similarity - a.similarity);
    return NextResponse.json({ matches: matches.slice(0, 3) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
} 