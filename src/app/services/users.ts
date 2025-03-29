import { databases, ID, storage } from '../appwrite'; // Import Appwrite services
import { Query } from 'appwrite';

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const usersCollectionId = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;
const storageId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!;

export const createUser = async (userData: any, imageId?: string) => { // Add imageId parameter
    try {
        if (imageId) {
            userData.image = imageId; // Include imageId in userData
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
        if (response.documents.length > 0) {
            return response.documents[0];
        }
        return null;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
};

export const updateUser = async (documentId: string, userData: any) => {
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