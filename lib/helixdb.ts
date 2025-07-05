import HelixDB from 'helix-ts';

// Initialize HelixDB client
export const helix = new HelixDB(process.env.HELIXDB_BASE_URL || 'http://localhost:6969');

// Helper function to create embeddings for text
export async function createEmbedding(text: string) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-3-small',
    }),
  });
  const data = await response.json();
  return data.data[0].embedding;
}

// Helper function to search for similar content
export async function helixSearch(collection: string, queryEmbedding: number[], limit = 5) {
  return helix.query('search', {
    collection,
    vector: queryEmbedding,
    limit,
    includeMetadata: true,
  });
}

// Helper function to add content to the vector store
export async function helixInsert(collection: string, id: string, embedding: number[], metadata: any) {
  return helix.query('insert', {
    collection,
    vectors: [
      {
        id,
        vector: embedding,
        metadata,
      },
    ],
  });
} 