import React, { useState } from 'react';
import { useGetActiveLogoQuery } from '@/redux/api/logoApi';

interface BrandLogoProps {
  className?: string;
  imgClassName?: string;
  fallback?: React.ReactNode;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  imgClassName = '',
  fallback,
  fallbackText = '🇩🇪',
  size = 'md',
}) => {
  const { data: logoData } = useGetActiveLogoQuery(undefined);
  const [imageError, setImageError] = useState(false);

  const activeUrl = logoData?.data?.url;

  const sizeClasses: Record<string, string> = {
    sm: 'w-8 h-8 rounded-lg text-sm',
    md: 'w-10 h-10 rounded-xl text-lg',
    lg: 'w-12 h-12 rounded-2xl text-2xl',
    xl: 'w-14 h-14 rounded-2xl text-3xl',
    custom: '',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  if (activeUrl && !imageError) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden bg-white p-1 border border-violet-100 shadow-sm shrink-0 ${currentSizeClass} ${className}`}
      >
        <img
          src={activeUrl}
          alt="DeutschLernen"
          onError={() => setImageError(true)}
          className={`w-full h-full object-contain ${imgClassName}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center shrink-0 ${currentSizeClass} ${className}`}
    >
      {fallback || <span>{fallbackText}</span>}
    </div>
  );
};

export default BrandLogo;
