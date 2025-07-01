import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const { message, conversationHistory } = await req.json()
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Build conversation context
    const contextMessages = (conversationHistory || []).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    // System prompt
    const systemPrompt = `You are an AI assistant for ColabBoard, a platform that helps students find teammates for academic projects and competitions. You should be helpful, encouraging, and knowledgeable about:\n\n- Team building and collaboration\n- Academic competitions (ISEF, Science Olympiad, etc.)\n- Project management and organization\n- Communication and leadership skills\n- Finding the right teammates\n- Competition strategies and tips\n- Student collaboration best practices\n\nKeep responses conversational, friendly, and practical. Provide specific, actionable advice when possible. If asked about topics outside your expertise, politely redirect to relevant topics you can help with.\n\nCurrent conversation context:`

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Compose the chat history for the SDK
    const chatHistory = [
      ...contextMessages,
      { role: "user", parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }] }
    ]

    const result = await model.generateContent({ contents: chatHistory })
    const aiResponse = result.response.text()

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error("AI chat error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
} 