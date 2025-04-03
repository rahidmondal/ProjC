import { databases, ID } from '../appwrite';

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const skillTestsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_SKILLTEST_COLLECTION_ID!;

export const saveTestResult = async (
    userId: string,
    skill: string,
    level: string,
    score: number,
    totalQuestions: number,
    correctAnswers: number,
) => {
    try {
        const timeStamp = new Date().toISOString();
        const testId = ID.unique();

        const testResult = {
            userId,
            skill,
            level,
            score,
            totalQuestions,
            correctAnswers,
            timeStamp,
            testId,
        };

        return await databases.createDocument(databaseId, skillTestsCollectionId, testId, testResult);
    } catch (error) {
        console.error('Error saving test result:', error);
        throw error;
    }
};