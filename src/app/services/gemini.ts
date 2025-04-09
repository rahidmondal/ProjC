import fetch from 'node-fetch';

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GOOGLE_API_KEY is not set in environment variables.");
}

export async function generateQuestionsFromGemini(skill: string, level: string): Promise<Question[]> {
  console.log(`Generating questions for skill: ${skill}, level: ${level}`);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const prompt = `Generate 10 multiple-choice questions for a ${level} level test on ${skill}. Each question should have 4 options and a correct answer. Respond in JSON format, with each question object having the following structure: { "question": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "..." }.`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;

    text = text.replace('```json', '').replace('```', '').trim();

    const questions: Question[] = JSON.parse(text);
    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}