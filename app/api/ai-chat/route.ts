import { NextRequest, NextResponse } from 'next/server';
import { helixSearch, createEmbedding } from '../../../lib/helixdb';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    // Generate embedding for the user query
    const embedding = await createEmbedding(message);
    // Search HelixDB for relevant results
    const result = await helixSearch('mentors', embedding, 5);

    return NextResponse.json({ results: result });
  } catch (error: unknown) {
    console.error('RAG API error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
} 