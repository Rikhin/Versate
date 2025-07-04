import { NextRequest, NextResponse } from "next/server"

const NVIDIA_API_KEY = "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"
const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = body.query || body.message
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }
    // General system prompt for a helpful, conversational assistant
    const messages = [
      { role: "system", content: "You are a friendly, helpful, and conversational AI assistant. Respond in natural, human-like language and format your answers clearly for the user." },
      { role: "user", content: message }
    ]
    const nvidiaRes = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "nvidia/llama-3.1-nemotron-ultra-253b-v1",
        messages,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 1024,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false
      })
    })
    // Try to parse as JSON, fallback to NDJSON if needed
    let nvidiaData
    const contentType = nvidiaRes.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      nvidiaData = await nvidiaRes.json()
    } else {
      // Try to parse as NDJSON (newline-delimited JSON)
      const text = await nvidiaRes.text()
      const firstLine = text.split('\n').find(line => line.trim().startsWith('{'))
      nvidiaData = firstLine ? JSON.parse(firstLine) : { error: text }
    }
    if (!nvidiaRes.ok) {
      return NextResponse.json({ error: nvidiaData.error || JSON.stringify(nvidiaData) || "Nvidia API error" }, { status: 500 })
    }
    const text = nvidiaData.choices?.[0]?.message?.content || "No response"
    const results = [
      {
        title: "AI Assistant",
        description: text
      }
    ]
    return NextResponse.json({ results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
} 