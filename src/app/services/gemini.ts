// src/services/gemini.ts

import fetch from 'node-fetch';

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface GeminiResponsePart {
  text: string;
}

interface GeminiContent {
  parts: GeminiResponsePart[];
}

interface GeminiCandidate {
  content: GeminiContent;
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
}

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

export async function generateQuestionsFromGemini(skill: string, level: string): Promise<Question[]> {
  // console.log(`Generating questions for skill: ${skill}, level: ${level}`);

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

    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      // console.error("Invalid or unexpected response format from Gemini API");
      return [];
    }
    
    let text = data.candidates[0].content.parts[0].text;

    text = text.replace('```json', '').replace('```', '').trim();

    // console.log("Raw Gemini Response:", text); 
    const jsonStartIndex = text.indexOf('[');
    const jsonEndIndex = text.lastIndexOf(']');

    if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonStartIndex < jsonEndIndex) {
      const jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);

      try {
        const questions: Question[] = JSON.parse(jsonString);
        return questions;
      } catch {
        // console.error("Error parsing JSON");
        return [];
      }
    } else {
      // console.error("Could not find valid JSON array in response.");
      return [];
    }

  } catch {
    // console.error("Error generating questions");
    return [];
  }
}