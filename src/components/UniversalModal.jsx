'use client';

import React, { useEffect, useRef } from 'react';
import { X, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';

export const UniversalModal = ({
  title,
  subtitle,
  badge,
  badgeColor = 'emerald', // 'emerald' | 'amber' | 'teal' | 'purple' | 'slate'
  content,
  children,
  image,
  imageAlt = 'Rent on Cent Modal Image',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  primaryAction,
  secondaryAction,
  onClose
}) => {
  const modalRef = useRef(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-4xl'
  };

  const badgeStyles = {
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    teal: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    slate: 'bg-slate-700/40 text-slate-300 border-slate-600/40'
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="universal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xl animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`relative w-full ${
          sizeClasses[size] || sizeClasses.md
        } bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden text-slate-100 flex flex-col max-h-[90vh] transition-all transform animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Apple-style floating ambient specular highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Optional Header Image with gradient overlay */}
        {image && (
          <div className="relative h-44 sm:h-56 w-full overflow-hidden shrink-0 bg-slate-950">
            <img
              src={image}
              alt={imageAlt}
              className="w-full h-full object-cover object-center filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            {badge && (
              <div className="absolute bottom-3 left-5">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${
                    badgeStyles[badgeColor] || badgeStyles.emerald
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {badge}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Modal Header */}
        <div className={`p-5 sm:p-6 pb-2 ${image ? 'pt-3' : 'pt-6'}`}>
          {!image && badge && (
            <div className="mb-2">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  badgeStyles[badgeColor] || badgeStyles.emerald
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                {badge}
              </span>
            </div>
          )}
          {title && (
            <h3
              id="universal-modal-title"
              className="text-lg sm:text-xl font-extrabold text-white tracking-tight font-heading leading-snug"
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="px-5 sm:px-6 py-3 overflow-y-auto custom-scrollbar flex-1 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
          {typeof content === 'string' ? (
            <div className="whitespace-pre-line text-slate-300">{content}</div>
          ) : Array.isArray(content) ? (
            <div className="space-y-2.5">
              {content.map((paragraph, idx) => (
                <p key={idx} className="text-slate-300">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            content
          )}

          {children}
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-6 pt-3 border-t border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center justify-end gap-2.5">
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick || onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 transition-all active:scale-95 cursor-pointer"
            >
              {secondaryAction.text || 'Dismiss'}
            </button>
          )}

          {primaryAction && (
            primaryAction.href ? (
              <a
                href={primaryAction.href}
                target={primaryAction.href.startsWith('http') ? '_blank' : '_self'}
                rel={primaryAction.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={primaryAction.onClick}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95 ${
                  primaryAction.variant === 'amber'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                }`}
              >
                <span>{primaryAction.text}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer ${
                  primaryAction.variant === 'amber'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                }`}
              >
                <span>{primaryAction.text}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )
          )}

          {!primaryAction && !secondaryAction && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-all active:scale-95 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              Got it
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
