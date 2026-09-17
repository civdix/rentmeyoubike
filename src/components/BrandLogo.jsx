import React from 'react';

/**
 * Official Brand Logo Component
 * Supports 'icon', 'full', and 'badge' variants for responsive and theme-adaptive rendering
 */
export const BrandLogo = ({
  variant = 'icon',
  className = '',
  size = 'md',
  showTagline = true,
  theme = 'dark'
}) => {
  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <img
          src="/full_Logo_rentoncent.svg"
          alt="Rentoncent - Peer to Peer Bike Sharing"
          className="h-8 sm:h-10 w-auto object-contain"
        />
      </div>
    );
  }

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-8 h-8 sm:w-10 sm:h-10',
    lg: 'w-10 h-10 sm:w-12 sm:h-12',
    xl: 'w-14 h-14 sm:w-16 sm:h-16'
  }[size] || 'w-8 h-8 sm:w-10 sm:h-10';

  if (variant === 'badge') {
    return (
      <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
        <div className={`${sizeClasses} rounded-xl sm:rounded-2xl bg-white p-1 sm:p-1.5 shadow-md border border-emerald-400/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
          <img
            src="/logo_square_share_area.png"
            alt="Rentoncent Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className={`font-heading font-extrabold tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'} text-base sm:text-xl leading-tight whitespace-nowrap`}>
              Rent to Cent
            </span>
            <span className="hidden md:inline-block bg-emerald-950/90 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-800">
              P2P Bikes
            </span>
          </div>
          {showTagline && (
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:flex items-center gap-1 truncate">
              Peer-to-Peer Bike Sharing
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default: icon only
  return (
    <div className={`${sizeClasses} rounded-xl sm:rounded-2xl bg-white flex items-center justify-center p-1 sm:p-1.5 shadow-md border border-emerald-400/40 shrink-0 ${className}`}>
      <img
        src="/logo_square_share_area.png"
        alt="Rentoncent Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default BrandLogo;
