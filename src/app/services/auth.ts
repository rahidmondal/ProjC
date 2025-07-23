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
    // console.error("Login failed:", message);
    throw new Error(message);
  }
};

export const register = async (name: string, email: string, password: string) => {
  try {
    // 1. Create the authentication user
    const newAuthUser = await account.create(ID.unique(), email, password, name);
    // console.log("Auth user created:", newAuthUser.$id);

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
        await createUser(initialProfileData);
        // console.log("User profile document created:", newUserProfile.$id);
    } catch {
        // console.error("Failed to create user profile document after registration:", dbError);

    }

    // 3. Log the user in after successful registration and DB record creation attempt
    return login(email, password);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown registration error occurred.";
    // console.error("Registration failed:", message);

    throw new Error(message);
  }
};



export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown logout error occurred.";
    // console.error("Logout failed:", message);
    throw new Error(message);
  }
};