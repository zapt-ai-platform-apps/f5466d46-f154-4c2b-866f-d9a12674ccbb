import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;