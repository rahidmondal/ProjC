import React from 'react';
import ProtectedRoute from '../Components/ProtectedRoute';


function SkillTestPage() {
    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h1 className="text-2xl font-bold">Skill Test Page</h1>
                <p className="text-lg text-gray-600">This page is currently under development. Please check back later!</p>
            </div>
        </ProtectedRoute>
    );
}

export default SkillTestPage;