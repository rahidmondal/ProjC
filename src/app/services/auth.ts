"use client";

import { account, ID } from "../appwrite";

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
  } catch (error) {
    throw new Error(error.message);
  }
};

export const register = async (name: string, email: string, password: string) => {
  try {
    await account.create(ID.unique(), email, password, name);
    return login(email, password); 
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    throw new Error(error.message);
  }
};
