/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        kr: ['"Noto Sans KR"', 'sans-serif'], // Korean
        jp: ['"Noto Sans JP"', 'sans-serif'], // Japanese
        sc: ['"Noto Sans SC"', 'sans-serif'], // Simplified Chinese
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};