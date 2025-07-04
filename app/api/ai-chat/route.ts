import { NextRequest, NextResponse } from "next/server"

const NVIDIA_API_KEY = "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"
const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions" // Replace with actual endpoint if different

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }
    // Call Nvidia Llama-3_1-Nemotron-Ultra-253B-v1 API
    const nvidiaRes = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3_1-nemotron-ultra-253b-v1",
        prompt: message
      })
    })
    const nvidiaData = await nvidiaRes.json()
    if (!nvidiaRes.ok) {
      return NextResponse.json({ error: nvidiaData.error || "Nvidia API error" }, { status: 500 })
    }
    // Assume response is { result: string }
    return NextResponse.json({ response: nvidiaData.result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
} 