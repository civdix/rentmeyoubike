import React from 'react';

// 1. Unique Vrindavan Scooter / Two-Wheeler Icon
export const VrindavanScooterIcon = ({ className = "w-5 h-5", strokeWidth = 2 }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="18" r="3" />
    <path d="M6 18h4l2-6h5l2 3h-1" />
    <path d="M12 12V7h3" />
    <path d="M12 7h-2" />
    <path d="M18 18v-3" />
  </svg>
);

// 2. Custom Peacock Feather (Radhe Radhe Divine Symbol)
export const VrindavanFeatherIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C9 5 5 9 5 14c0 3.87 3.13 7 7 7s7-3.13 7-7c0-5-4-9-7-12zm0 17c-2.76 0-5-2.24-5-5 0-3.1 3-6.2 5-8.4 2 2.2 5 5.3 5 8.4 0 2.76-2.24 5-5 5z" />
    <circle cx="12" cy="14" r="2" fill="#D97706" />
  </svg>
);

// 3. Custom Double-Check Verified Shield Icon
export const VerifiedShieldIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" strokeWidth="2.5" />
  </svg>
);

// 4. Authentic WhatsApp Icon
export const WhatsAppBrandIcon = ({ className = "w-4 h-4", fill = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill={fill}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// 5. Dual Helmet Icon ("2 Free Helmets Included")
export const HelmetsIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4a8 8 0 0 0-8 8v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3a8 8 0 0 0-8-8z" />
    <path d="M6 15v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1" />
    <path d="M12 4v4" />
    <path d="M8 12h8" />
  </svg>
);

// 6. Odometer / Speedometer Inspection Gauge Icon
export const OdometerGaugeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
    <path d="M12 12l4-4" strokeWidth="2.5" />
    <path d="M8 12a4 4 0 1 0 8 0" />
  </svg>
);

// 7. Digital Inspection Audit Icon (Camera + Checklist)
export const DigitalInspectionIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="m16 8 2-2" />
  </svg>
);

// 8. Temple Pass Ready Icon
export const VrindavanTemplePassIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3L4 9v12h16V9l-8-6z" />
    <path d="M9 21v-6a3 3 0 0 1 6 0v6" />
  </svg>
);

// 9. Rupee Currency Stack Icon
export const RupeeStackIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="M6 8a5 5 0 0 0 5 5h-5" />
    <path d="M11 13l6 8" />
  </svg>
);

// 10. Key Handover Host Icon (Horizontal Ignition Key - No resemblance to female symbol)
export const KeyHandoverIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="12" r="3.5" />
    <path d="M11 12h10v-3l-2-2v2h-2v-2h-2v2h-2v-2" />
  </svg>
);

// 11. "Bike Saathi" Local Guide Rider Icon
export const BikeSaathiIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
    <path d="M19 11v2a7 7 0 0 1-14 0v-2" />
    <path d="M12 18v4" />
    <path d="M8 22h8" />
  </svg>
);

// 12. Damage Scratch Logger Reticle Icon
export const ScratchReticleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="3" x2="12" y2="7" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <line x1="3" y1="12" x2="7" y2="12" />
    <line x1="17" y1="12" x2="21" y2="12" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);
