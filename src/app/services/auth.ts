"use client";

import { account, ID } from "../appwrite";
import { createUser } from "./users"; 

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};

export const login = async (email: string, password: string) => {
  try {
    await account.createEmailPasswordSession(email, password);
    return getCurrentUser();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown login error occurred.";
    console.error("Login failed:", message);
    throw new Error(message);
  }
};

export const register = async (name: string, email: string, password: string) => {
  try {
    // 1. Create the authentication user
    const newAuthUser = await account.create(ID.unique(), email, password, name);
    console.log("Auth user created:", newAuthUser.$id);

    // 2. **Immediately create the corresponding database document**
    try {
        const initialProfileData = {
            userId: newAuthUser.$id, // Link to the auth user ID
            email: email,
            name: name,
            // Add other default fields required by your 'users' collection schema
            title: "",
            website: "",
            github: "",
            linkedin: "",
            image: null,
            skills: [],
            description: "",
            skillScore: [],
        };
        const newUserProfile = await createUser(initialProfileData);
        console.log("User profile document created:", newUserProfile.$id);
    } catch (dbError: unknown) {
        console.error("Failed to create user profile document after registration:", dbError);
        // Consider adding more robust error handling here
        // e.g., delete the auth user if the DB record fails?
        // await account.delete(newAuthUser.$id); // Requires admin privileges usually
        // throw new Error("Failed to finalize registration."); // Or inform user
    }

    // 3. Log the user in after successful registration and DB record creation attempt
    return login(email, password);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown registration error occurred.";
    console.error("Registration failed:", message);
    // Example: Check for specific Appwrite user already exists error
    // Note: Need to import AppwriteException if using this check
    // import { AppwriteException } from 'appwrite';
    // if (error instanceof AppwriteException && error.code === 409) {
    //   throw new Error("User with this email already exists.");
    // }
    throw new Error(message);
  }
};



export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown logout error occurred.";
    console.error("Logout failed:", message);
    throw new Error(message);
  }
};