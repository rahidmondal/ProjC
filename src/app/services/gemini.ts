export interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
  }
  
  export async function generateQuestionsFromGemini(skill: string, level: string): Promise<Question[]> {
    console.log(`Generating questions for skill: ${skill}, level: ${level}`);
  
    const dummyQuestions: Question[] = [
      {
        question: `What is a fundamental concept of ${skill} at ${level} level?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
      },
      {
        question: `Another important ${skill} concept for ${level}?`,
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswer: 'Option 2',
      },
    ];
  
    return dummyQuestions;
  }
  