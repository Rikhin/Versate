import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_CHAT_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

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
    const conversationContext = conversationHistory?.map((msg: Message) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })) || []

    // Create the prompt with context about the platform
    const systemPrompt = `You are an AI assistant for ColabBoard, a platform that helps students find teammates for academic projects and competitions. You should be helpful, encouraging, and knowledgeable about:

- Team building and collaboration
- Academic competitions (ISEF, Science Olympiad, etc.)
- Project management and organization
- Communication and leadership skills
- Finding the right teammates
- Competition strategies and tips
- Student collaboration best practices

Keep responses conversational, friendly, and practical. Provide specific, actionable advice when possible. If asked about topics outside your expertise, politely redirect to relevant topics you can help with.

Current conversation context:`

    const fullPrompt = `${systemPrompt}\n\nUser: ${message}`

    // Prepare the request to Gemini
    const geminiRequest = {
      contents: [
        ...conversationContext,
        {
          role: "user",
          parts: [{ text: fullPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    }

    const response = await fetch(`${GEMINI_CHAT_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(geminiRequest),
    })

    if (!response.ok) {
      console.error("Gemini API error:", response.status, response.statusText)
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 500 }
      )
    }

    const data = await response.json()

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error("Unexpected Gemini response format:", data)
      return NextResponse.json(
        { error: "Invalid response from AI service" },
        { status: 500 }
      )
    }

    const aiResponse = data.candidates[0].content.parts[0].text

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("AI chat error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 