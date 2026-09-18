'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy, Send } from 'lucide-react';
import { WhatsAppBrandIcon } from './CustomIcons';

export const SocialShareBar = () => {
  const [copied, setCopied] = useState(false);

  const shareUrl = 'https://rentoncent.bond';
  const shareTitle = 'Rent on Cent — #1 Bike & Scooty Rental in Vrindavan & Mathura';
  const shareText = 'Rent Honda Activa, EV Scooters & Bikes in Vrindavan starting ₹299/day with verified local hosts: ';

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedMessage = encodeURIComponent(`${shareText}${shareUrl}`);

  return (
    <section className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white py-10 px-4 border-t border-b border-teal-900/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="text-center md:text-left space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-extrabold px-3 py-1 rounded-full">
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Traveling to Vrindavan with Family &amp; Friends?</span>
          </div>
          <p className="font-heading font-extrabold text-xl sm:text-2xl text-white">
            Share Rent on Cent with Fellow Pilgrims
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Help fellow devotees save time &amp; avoid auto-rickshaw bargaining. Share trusted two-wheeler rental options for Prem Mandir, Bankey Bihari &amp; Govardhan Parikrama.
          </p>
        </div>

        {/* Social Share Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {/* WhatsApp Share */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodedMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share Rent on Cent on WhatsApp"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
          >
            <WhatsAppBrandIcon className="w-4 h-4 fill-white" />
            <span>WhatsApp</span>
          </a>

          {/* Telegram Share */}
          <a
            href={`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share Rent on Cent on Telegram"
            className="inline-flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram</span>
          </a>

          {/* X / Twitter Share */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share Rent on Cent on X Twitter"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-700 shadow-md transition-all active:scale-95"
          >
            <span className="font-bold font-serif text-sm">𝕏</span>
            <span>Post</span>
          </a>

          {/* Facebook Share */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share Rent on Cent on Facebook"
            className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
          >
            <span className="font-bold text-sm">f</span>
            <span>Share</span>
          </a>

          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="Copy website link to clipboard"
            className={`inline-flex items-center gap-2 text-xs font-bold py-2.5 px-4 rounded-xl transition-all active:scale-95 border cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Copied Link!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
