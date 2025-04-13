import { databases, ID } from "../appwrite";
import { Query } from "appwrite";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const projectsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID!;

export const createProject = async (projectData: unknown) => {
  try {
    return await databases.createDocument(databaseId, projectsCollectionId, ID.unique(), projectData);
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProject = async (documentId: string) => {
  try {
    return await databases.getDocument(databaseId, projectsCollectionId, documentId);
  } catch (error) {
    console.error("Error getting project:", error);
    throw error;
  }
};

export const updateProject = async (documentId: string, projectData: unknown) => {
  try {
    return await databases.updateDocument(databaseId, projectsCollectionId, documentId, projectData);
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (documentId: string) => {
  try {
    return await databases.deleteDocument(databaseId, projectsCollectionId, documentId);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const listProjects = async () => {
  try {
    const response = await databases.listDocuments(databaseId, projectsCollectionId);
    return response.documents;
  } catch (error) {
    console.error("Error listing projects:", error);
    throw error;
  }
};

export const listProjectsByUser = async (userId: string) => {
  try {
    const response = await databases.listDocuments(databaseId, projectsCollectionId, [
      Query.equal("projectProposer", userId),
    ]);
    return response.documents;
  } catch (error) {
    console.error("Error listing projects by user:", error);
    throw error;
  }
};
