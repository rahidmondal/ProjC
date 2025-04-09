// src/app/api/genAI/generate-questions/route.ts

import { generateQuestionsFromGemini } from "../../../services/gemini";
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skill = searchParams.get('skill');
  const level = searchParams.get('level');

  if (!skill || !level) {
    return NextResponse.json({ error: 'Skill and level are required' }, { status: 400 });
  }

  try {
    const questions = await generateQuestionsFromGemini(skill, level); // Await here
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
  }
}