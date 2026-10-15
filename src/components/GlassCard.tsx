import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'blue' | 'violet' | 'cyan' | 'none';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = 'none',
  onClick
}) => {
  const glowClasses = {
    blue: 'hover:shadow-glow-blue hover:border-electric-500/40',
    violet: 'hover:shadow-glow-violet hover:border-violet-500/40',
    cyan: 'hover:shadow-glow-cyan hover:border-cyan-500/40',
    none: 'hover:border-slate-700/60'
  };

  return (
    <div
      onClick={onClick}
      className={`relative bg-dark-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl transition-all duration-300 ${glowClasses[glow]} ${className}`}
    >
      {children}
    </div>
  );
};
