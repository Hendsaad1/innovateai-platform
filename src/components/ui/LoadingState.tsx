import React from 'react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data securely from INnovateAI server...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-[#8B2FC9] animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-purple-300/10 border-b-[#5C0F82] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
      </div>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
};
