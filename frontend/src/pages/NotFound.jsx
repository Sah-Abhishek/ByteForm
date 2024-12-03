import React from 'react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center p-8">
            <div className="bg-white shadow-lg rounded-lg p-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-6">Oops! The page you're looking for doesn't exist.</p>
                <a
                    href="/"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-lg hover:bg-blue-600"
                >
                    Go Back Home
                </a>
            </div>
        </div>
    );
};

export default NotFound;
