
import React from 'react';

export const BeliargSeal: React.FC<{ className?: string }> = ({ className = "w-32 h-32" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
       {/* Global Glow */}
       <div className="absolute inset-0 rounded-full bg-hell-lava/20 blur-lg animate-pulse-slow"></div>

       <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="magmaGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
          </defs>

          {/* Layer 1: Rotating Outer Runes */}
          <g className="origin-center animate-[spin_60s_linear_infinite]">
             {/* Ring */}
             <circle cx="50" cy="50" r="48" fill="none" stroke="url(#goldGrad)" strokeWidth="1" strokeDasharray="1 4" opacity="0.6" />
             <circle cx="50" cy="50" r="44" fill="none" stroke="var(--hell-800)" strokeWidth="8" />
             
             {/* Runes */}
             {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
               <g key={deg} transform={`rotate(${deg} 50 50)`}>
                  <path d="M48 8 L52 8 L50 14 Z" fill="var(--hell-gold)" />
                  <circle cx="50" cy="18" r="1" fill="var(--hell-lava)" />
               </g>
             ))}
          </g>

          {/* Layer 2: The Pentagram */}
          <g className="origin-center animate-[spin_20s_linear_infinite_reverse] opacity-80">
             {/* Star shape constructed manually for perfect alignment */}
             <path 
                d="M50 20 L60 80 L10 45 L90 45 L40 80 Z" 
                fill="none" 
                stroke="var(--hell-gold)" 
                strokeWidth="0.5" 
             />
             <circle cx="50" cy="50" r="32" fill="var(--hell-900)" stroke="var(--hell-lava)" strokeWidth="0.5" />
          </g>

          {/* Layer 3: Central Demon Skull (High Contrast) */}
          <g transform="translate(50, 53) scale(0.9)">
             {/* Horns */}
             <path d="M-15 -15 Q -25 -35 -35 -25 Q -25 -10 -18 -5" fill="var(--hell-800)" stroke="url(#goldGrad)" strokeWidth="1" />
             <path d="M15 -15 Q 25 -35 35 -25 Q 25 -10 18 -5" fill="var(--hell-800)" stroke="url(#goldGrad)" strokeWidth="1" />

             {/* Skull Shape */}
             <path d="M-18 -5 C -20 -20, 20 -20, 18 -5 L 12 20 L 0 25 L -12 20 Z" fill="var(--hell-900)" stroke="url(#goldGrad)" strokeWidth="1" />
             
             {/* Glowing Eyes */}
             <path d="M-10 0 L -4 3 L -8 8 Z" fill="#ffffff" className="animate-pulse" />
             <path d="M10 0 L 4 3 L 8 8 Z" fill="#ffffff" className="animate-pulse" />
             
             {/* Forehead Gem */}
             <path d="M0 -10 L 4 -15 L 0 -20 L -4 -15 Z" fill="var(--hell-500)" className="animate-flicker" />
             
             {/* Teeth/Grin */}
             <path d="M-6 15 L -6 20 M -2 16 L -2 21 M 2 16 L 2 21 M 6 15 L 6 20" stroke="var(--hell-gold)" strokeWidth="1" strokeLinecap="round" />
          </g>
       </svg>
    </div>
  );
};
