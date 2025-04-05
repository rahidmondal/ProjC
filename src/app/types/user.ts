export interface User {
    id?: string;        
    userId: string;  
    name: string;
    email: string;       
    title?: string | null; 
    website?: string | null;
    github?: string | null;
    linkedin?: string | null;
    image?: string | null;  
    skills?: string[];     
    description?: string | null;
    skillScore?: string[];  // Array of skill score strings (e.g., "Skill:Level:Score")

    [key: string]: unknown;
  }