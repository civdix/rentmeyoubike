/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
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
          DEFAULT: 'var(--brand-DEFAULT, #059669)',
        },
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
          DEFAULT: 'var(--saffron-DEFAULT, #f59e0b)',
        },
        whatsapp: {
          light: 'var(--whatsapp-primary, #25D366)',
          hover: 'var(--whatsapp-hover, #20ba5a)',
          dark: 'var(--whatsapp-dark, #128C7E)',
          subtle: 'var(--whatsapp-subtle, #dcf8c6)',
          DEFAULT: 'var(--whatsapp-primary, #25D366)',
        },
        themeDark: {
          base: 'var(--dark-base, #020617)',
          surface: 'var(--dark-surface, #0f172a)',
          card: 'var(--dark-card, #1e293b)',
          border: 'var(--dark-border, #334155)',
        },
        themeLight: {
          base: 'var(--light-base, #f8fafc)',
          surface: 'var(--light-surface, #ffffff)',
          card: 'var(--light-card, #ffffff)',
          border: 'var(--light-border, #e2e8f0)',
          borderSubtle: 'var(--light-border-subtle, #f1f5f9)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
