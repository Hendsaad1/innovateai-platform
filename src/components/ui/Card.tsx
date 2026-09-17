import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 ${
        glass
          ? 'bg-white/80 dark:bg-[#120A1D]/80 backdrop-blur-md border border-gray-200/80 dark:border-purple-900/40 shadow-xl'
          : 'bg-white dark:bg-[#120A1D] border border-gray-200 dark:border-purple-950 shadow-sm dark:shadow-none'
      } ${
        hoverEffect
          ? 'hover:border-[#8B2FC9]/60 hover:shadow-2xl hover:shadow-[#5C0F82]/10 hover:-translate-y-1'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
