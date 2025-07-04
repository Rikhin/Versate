import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://integrate.api.nvidia.com/v1",
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = body.query || body.message
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }
    const completion = await openai.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-ultra-253b-v1",
      messages: [
        { role: "system", content: "You are a friendly, helpful, and conversational AI assistant. Respond in natural, human-like language and format your answers clearly for the user." },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 1024,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false,
    })
    const text = completion.choices?.[0]?.message?.content || "No response"
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