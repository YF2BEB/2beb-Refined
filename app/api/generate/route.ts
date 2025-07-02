import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert prompt engineer. Refine the user's raw prompt into a clear, highly detailed instruction suitable for an AI model like GPT, Midjourney, or DALL·E."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const refined = response.choices[0].message.content;
    return NextResponse.json({ refined });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}