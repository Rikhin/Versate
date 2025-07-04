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
    // Nvidia expects a 'messages' array with role/content
    const nvidiaRes = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "nvidia/llama-3_1-nemotron-ultra-253b-v1",
        messages: [
          { role: "user", content: message }
        ]
      })
    })
    const nvidiaData = await nvidiaRes.json()
    if (!nvidiaRes.ok) {
      return NextResponse.json({ error: nvidiaData.error || JSON.stringify(nvidiaData) || "Nvidia API error" }, { status: 500 })
    }
    // Parse the response: choices[0].message.content
    const text = nvidiaData.choices?.[0]?.message?.content || "No response"
    const results = [
      {
        title: "AI Search Result",
        description: text
      }
    ]
    return NextResponse.json({ results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
} 