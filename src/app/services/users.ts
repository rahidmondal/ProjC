import { databases, ID, storage } from '../appwrite';
import { Query } from 'appwrite';
import { User } from '../types/user';

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const usersCollectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
const storageId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!;

export const createUser = async (userData: User, imageId?: string) => {
    try {
        if (imageId) {
            userData.image = imageId;
        }
        return await databases.createDocument(databaseId, usersCollectionId, ID.unique(), userData);
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const getUser = async (userId: string) => {
    try {
        const response = await databases.listDocuments(databaseId, usersCollectionId, [Query.equal('userId', userId)]);
        return response.documents.length > 0 ? response.documents[0] : null;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
};

export const getUserSkills = async (userId: string) => {
    try {
        const user = await getUser(userId);
        // Filter out empty strings and invalid values from skills
        const skills = Array.isArray(user?.skills) ? user.skills.filter(skill => skill.trim() !== "") : [];
        console.log("Final filtered skills:", skills);
        return skills;
    } catch (error) {
        console.error("Error fetching user skills:", error);
        return [];
    }
};


export const updateUser = async (documentId: string, userData: User) => {
    try {
        return await databases.updateDocument(databaseId, usersCollectionId, documentId, userData);
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (documentId: string) => {
    try {
        return await databases.deleteDocument(databaseId, usersCollectionId, documentId);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export const uploadUserImage = async (file: File) => {
    try {
        return await storage.createFile(storageId, ID.unique(), file);
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const getUserImageUrl = (fileId: string) => {
    return storage.getFilePreview(storageId, fileId);
};

export const deleteUserImage = async (fileId: string) => {
    try {
        await storage.deleteFile(storageId, fileId);
        console.log('Image deleted successfully.');
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};


export const updateUserSkillScore = async (
    userId: string,
    skill: string,
    level: string,
    score: number
) => {
    if (!userId || !skill || !level || score === undefined || score === null) {
        console.error('Missing parameters for updateUserSkillScore');
        throw new Error('Missing parameters for updating skill score.');
    }

    try {
        // 1. Get the current user document
        const userDoc = await getUser(userId);
        if (!userDoc) {
            console.error(`User document not found for userId: ${userId}`);
            throw new Error('User not found.');
        }

        // 2. Prepare the new score string
        const newScoreString = `${skill}:${level}:${score}`;

        // 3. Get the current skillScores or initialize if null/undefined
        const currentSkillScores: string[] = Array.isArray(userDoc.skillScore) ? [...userDoc.skillScore] : [];

        // 4. Find if the skill already exists in the array
        const existingIndex = currentSkillScores.findIndex(s => {
            const [existingSkill, existingLevel] = s.split(':');
            return existingSkill === skill && existingLevel === level;
        });

        // 5. Update or add the score
        if (existingIndex > -1) {
            // Update the existing entry
            currentSkillScores[existingIndex] = newScoreString;
            console.log(`Updated skill score for ${skill}: ${newScoreString}`);
        } else {
            // Add the new entry
            currentSkillScores.push(newScoreString);
            console.log(`Added new skill score: ${newScoreString}`);
        }

        // 6. Update the user document with the modified skillScore array
        await databases.updateDocument(
            databaseId,
            usersCollectionId,
            userDoc.$id,
            { skillScore: currentSkillScores } 
        );

        console.log(`Skill score updated successfully for user ${userId}`);
        return currentSkillScores; 

    } catch (error) {
        console.error('Error updating user skill score:', error);
        throw error;
    }
};
