'use client';

import React from 'react';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function UserAvatar({ size = 'md', className = '' }: UserAvatarProps) {
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
  };

  return (
    <div 
      className={`rounded-full bg-[#00305f] flex items-center justify-center text-white font-medium ${sizeClasses[size]} ${className}`}
    >
      Me
    </div>
  );
} 