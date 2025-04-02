import React from 'react';
import Link from 'next/link';

const GenAITestPlaceholder: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-700">
            <h1 className="text-2xl mb-5 text-gray-800 dark:text-gray-100">Generative AI Enabled Test 🤖</h1>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300 text-center">Under Construction 🚧</p>
            <Link href="/skill-test">
            <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-blue-700 transition-colors duration-300">Skill Test 🚀</button>
            </Link>
        </div>
    );
};

export default GenAITestPlaceholder;