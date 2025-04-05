import React from 'react';
import Link from 'next/link';
import { Award } from 'lucide-react'; 

interface ProfileDisplaySectionProps {
    title: string;
    actionButton?: {
        href: string;
        text: string;
    };
    children: React.ReactNode; 
    className?: string;
}

export const ProfileDisplaySection: React.FC<ProfileDisplaySectionProps> = ({
    title,
    actionButton,
    children,
    className = "mb-6 pb-4 border-b dark:border-gray-600" 
}) => {
    return (
        <div className={className}>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
                {actionButton && (
                    <Link href={actionButton.href}>
                        <button className="bg-purple-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition font-medium">
                            {actionButton.text}
                        </button>
                    </Link>
                )}
            </div>
            <div className="space-y-3"> {/* Default spacing for content */}
                 {children}
            </div>
        </div>
    );
};


// Example Helper for Skill Scores within the parent
export const renderSkillScores = (skillScores?: string[]) => {
    if (!skillScores || skillScores.length === 0) {
        return <p className="italic text-gray-500 dark:text-gray-400 text-sm">No skill test scores recorded yet.</p>;
    }
    return skillScores.map((scoreEntry: string, index: number) => {
        const parts = scoreEntry.split(':');
        if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
            const [skill, level, score] = parts;
            return (
                <div key={`${skill}-${level}-${index}`} className="flex items-center justify-between bg-gray-50 dark:bg-gray-600 p-3 rounded-lg border border-gray-200 dark:border-gray-500 shadow-sm">
                    <div className="flex items-center overflow-hidden mr-2">
                        <Award className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mr-3 flex-shrink-0" />
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-x-2">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate" title={skill}>{skill}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">({level})</span>
                        </div>
                    </div>
                    <span className="text-sm font-bold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-700/50 px-2 py-0.5 rounded">Score: {score}</span>
                </div>
            );
        }
        return null; // Skip invalid entries
    });
};

// Example Helper for Skills List within the parent
export const renderSkills = (skills?: string[]) => {
     const validSkills = skills?.filter(Boolean) ?? [];
     if (validSkills.length === 0) {
         return <p className="italic text-gray-500 dark:text-gray-400 text-sm">No skills listed.</p>;
     }
     return (
         <div className="flex flex-wrap gap-2">
             {validSkills.map((skill: string, index: number) => (
                 <span key={`${skill}-${index}`} className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
             ))}
         </div>
     );
};