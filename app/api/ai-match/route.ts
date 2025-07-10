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

function profileToText(profile: unknown): string {
  const p = profile as {
    first_name: string;
    last_name: string;
    bio: string;
    skills: string[];
    roles: string[];
    experience_level: string;
    time_commitment: string;
    collaboration_style: string[];
    location: string;
    competitions: { competitionId: string; interest: string }[];
  };
  return [
    p.first_name,
    p.last_name,
    p.bio,
    (p.skills || []).join(", "),
    (p.roles || []).join(", "),
    p.experience_level,
    p.time_commitment,
    (p.collaboration_style || []).join(", "),
    p.location,
    (p.competitions || []).map((c: { competitionId: string; interest: string }) => c.competitionId + ':' + c.interest).join(", ")
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
    const current = profiles.find((p: unknown) => (p as { user_id: string }).user_id === userId);
    if (!current) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // Get/generate embedding for current user
    let currentEmbedding = current.profile_embedding;
    if (!currentEmbedding) {
      const text = profileToText(current);
      currentEmbedding = await getEmbedding(text);
      await supabase.from("profiles").update({ profile_embedding: currentEmbedding }).eq("user_id", userId);
    }

    // Get/generate embeddings for all others
    const others = profiles.filter((p: unknown) => (p as { user_id: string }).user_id !== userId);
    for (const p of others) {
      if (!p.profile_embedding) {
        const text = profileToText(p);
        const emb = await getEmbedding(text);
        p.profile_embedding = emb;
        await supabase.from("profiles").update({ profile_embedding: emb }).eq("user_id", (p as { user_id: string }).user_id);
      }
    }

    // Compute similarity
    const matches = others.map((p: unknown) => ({
      user_id: (p as { user_id: string }).user_id,
      first_name: (p as { first_name: string }).first_name,
      last_name: (p as { last_name: string }).last_name,
      bio: (p as { bio: string }).bio,
      skills: (p as { skills: string[] }).skills,
      roles: (p as { roles: string[] }).roles,
      experience_level: (p as { experience_level: string }).experience_level,
      location: (p as { location: string }).location,
      avatar_url: (p as { avatar_url: string }).avatar_url,
      similarity: cosineSimilarity(currentEmbedding, (p as { profile_embedding: number[] }).profile_embedding)
    }));
    matches.sort((a, b) => b.similarity - a.similarity);
    return NextResponse.json({ matches: matches.slice(0, 3) });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message || "Unknown error" }, { status: 500 });
  }
} 