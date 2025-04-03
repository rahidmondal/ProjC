"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getCurrentUser } from '../services/auth'; 
import { getUser } from '../services/users';   
import { Models } from 'appwrite';
import { User as ProfileUser } from '../types/user';  

interface UserContextType {
  authUser: Models.User<Models.Preferences> | null;
  profileUser: ProfileUser | null;    
  isLoading: boolean;                 
  refetchUser: () => void;           
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  const fetchUserData = async () => {
    setIsLoading(true); 
    try {
    
      const currentAuthUser = await getCurrentUser();
      setAuthUser(currentAuthUser);

      if (currentAuthUser) {
        const existingProfileDoc: Models.Document | null = await getUser(currentAuthUser.$id);

        if (existingProfileDoc) {
 
          const profileData: ProfileUser = {
            id: existingProfileDoc.$id, 
            userId: existingProfileDoc.userId || currentAuthUser.$id,
            name: existingProfileDoc.name || currentAuthUser.name || "", 
            email: existingProfileDoc.email || currentAuthUser.email || "", 
            title: existingProfileDoc.title || "",
            website: existingProfileDoc.website || "",
            github: existingProfileDoc.github || "",
            linkedin: existingProfileDoc.linkedin || "",
            image: existingProfileDoc.image || null,
            skills: Array.isArray(existingProfileDoc.skills) ? existingProfileDoc.skills : [],
            description: existingProfileDoc.description || "",
            skillScore: Array.isArray(existingProfileDoc.skillScore) ? existingProfileDoc.skillScore : [],
          
          };
          setProfileUser(profileData); 

        } else {
          setProfileUser({
              id: undefined, // No document ID from DB
              userId: currentAuthUser.$id,
              name: currentAuthUser.name || "",
              email: currentAuthUser.email || "",
              title: '', website: '', github: '', linkedin: '', image: null,
              skills: [], description: '', skillScore: [],
          });
        }
      } else {
        setProfileUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data in context:", error);
      setAuthUser(null);
      setProfileUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); 
  return (
    <UserContext.Provider value={{ authUser, profileUser, isLoading, refetchUser: fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {

    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};