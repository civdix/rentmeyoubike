/**
 * Rent on Cent - Centralized Theme Colors
 * 
 * Edit colors here or in app/globals.css (:root variables) to customize
 * the visual identity across the entire website.
 */

export const THEME_COLORS = {
  // Primary Brand Identity (Emerald Green - Trust, Eco, Clean Mobility)
  brand: {
    50: 'var(--brand-50, #ecfdf5)',
    100: 'var(--brand-100, #d1fae5)',
    200: 'var(--brand-200, #a7f3d0)',
    300: 'var(--brand-300, #6ee7b7)',
    400: 'var(--brand-400, #34d399)',
    500: 'var(--brand-500, #10b981)',
    600: 'var(--brand-600, #059669)',
    700: 'var(--brand-700, #047857)',
    800: 'var(--brand-800, #065f46)',
    900: 'var(--brand-900, #064e3b)',
    primary: 'var(--brand-DEFAULT, #059669)',
  },

  // Sacred Saffron & Golden Amber (Vrindavan Braj Heritage)
  saffron: {
    50: 'var(--saffron-50, #fffbeb)',
    100: 'var(--saffron-100, #fef3c7)',
    200: 'var(--saffron-200, #fde68a)',
    300: 'var(--saffron-300, #fcd34d)',
    400: 'var(--saffron-400, #fbbf24)',
    500: 'var(--saffron-500, #f59e0b)',
    600: 'var(--saffron-600, #d97706)',
    700: 'var(--saffron-700, #b45309)',
    800: 'var(--saffron-800, #92400e)',
    900: 'var(--saffron-900, #78350f)',
    accent: 'var(--saffron-DEFAULT, #f59e0b)',
  },

  // Official WhatsApp Helpline Colors
  whatsapp: {
    primary: 'var(--whatsapp-primary, #25D366)',
    hover: 'var(--whatsapp-hover, #20ba5a)',
    dark: 'var(--whatsapp-dark, #128C7E)',
    subtle: 'var(--whatsapp-subtle, #dcf8c6)',
  },

  // Dark Theme Shell (Hero, Header, Dark Cards)
  dark: {
    base: 'var(--dark-base, #020617)',
    surface: 'var(--dark-surface, #0f172a)',
    card: 'var(--dark-card, #1e293b)',
    border: 'var(--dark-border, #334155)',
  },

  // Light Theme Shell (Page Body, White Cards, Borders)
  light: {
    base: 'var(--light-base, #f8fafc)',
    surface: 'var(--light-surface, #ffffff)',
    border: 'var(--light-border, #e2e8f0)',
    borderSubtle: 'var(--light-border-subtle, #f1f5f9)',
  },

  // Semantic Text Colors
  text: {
    primary: 'var(--text-main, #0f172a)',
    secondary: 'var(--text-secondary, #475569)',
    muted: 'var(--text-muted, #64748b)',
    onDark: 'var(--text-on-dark, #f8fafc)',
    onDarkMuted: 'var(--text-on-dark-muted, #cbd5e1)',
  }
};

export default THEME_COLORS;
