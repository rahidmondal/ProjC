import { NextRequest, NextResponse } from 'next/server';
import { generateQuestionsFromGemini } from '../../../services/gemini';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skill = searchParams.get('skill');
  const level = searchParams.get('level');

  if (!skill || !level) {
    return NextResponse.json({ error: 'Skill and level are required.' }, { status: 400 });
  }

  try {
    const questions = await generateQuestionsFromGemini(skill, level);
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json({ error: 'Failed to generate questions.' }, { status: 500 });
  }
}
