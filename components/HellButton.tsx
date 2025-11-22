import React from 'react';
import { audioService } from '../services/audioService';

interface HellButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gold';
  isLoading?: boolean;
}

export const HellButton: React.FC<HellButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '',
  ...props 
}) => {
  const baseStyles = "relative font-horror uppercase font-bold py-2 px-4 transition-all duration-300 transform active:scale-95 focus:outline-none clip-path-polygon";
  
  const variants = {
    primary: "bg-hell-800 text-hell-lava border border-hell-600 hover:bg-hell-700 hover:text-text-primary hover:border-hell-500 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]",
    secondary: "bg-bg-panel text-text-secondary border border-hell-700 hover:border-hell-600 hover:text-text-primary",
    danger: "bg-bg-panel text-red-600 border border-red-900/50 hover:bg-red-900/10 hover:border-red-600",
    gold: "bg-bg-panel text-hell-gold border border-hell-gold/50 hover:bg-hell-gold/10 hover:shadow-[0_0_15px_var(--hell-gold)]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      onMouseEnter={() => audioService.playHover()}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2 animate-pulse">
            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            ...
        </span>
      ) : children}
      
      {/* Decorative corners for buttons */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-current opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-current opacity-50"></div>
    </button>
  );
};