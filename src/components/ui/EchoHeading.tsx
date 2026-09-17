import React from 'react';

interface EchoHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const EchoHeading: React.FC<EchoHeadingProps> = ({
  text,
  as = 'h1',
  className = '',
  size = 'lg',
}) => {
  const Component = as;

  const sizeClasses = {
    sm: 'text-2xl sm:text-3xl font-bold tracking-tight',
    md: 'text-3xl sm:text-5xl font-black tracking-tighter',
    lg: 'text-3xl sm:text-6xl md:text-7xl font-black tracking-tighter',
    xl: 'text-4xl sm:text-7xl md:text-8xl font-black tracking-tighter',
  };

  return (
    <div className={`relative block w-full select-none py-2 overflow-hidden sm:overflow-visible ${className}`}>
      {/* Background Echo Layer 1 */}
      <span
        aria-hidden="true"
        className={`absolute top-0 left-1 translate-y-1 w-full opacity-20 text-[#8B2FC9] pointer-events-none select-none whitespace-normal break-words ${sizeClasses[size]}`}
      >
        {text}
      </span>
      {/* Background Echo Layer 2 */}
      <span
        aria-hidden="true"
        className={`absolute top-0 left-2 translate-y-2 w-full opacity-10 text-[#5C0F82] pointer-events-none select-none whitespace-normal break-words ${sizeClasses[size]}`}
      >
        {text}
      </span>
      {/* Foreground Main Text */}
      <Component className={`relative z-10 w-full text-gray-900 dark:text-white whitespace-normal break-words ${sizeClasses[size]}`}>
        {text}
      </Component>
    </div>
  );
};
