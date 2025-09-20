import { nextui } from '@nextui-org/react';
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: 'var(--font-jakarta)',
        mulish: 'var(--font-mulish)',
      },
      colors: {
        bgPrimary: '#FFFFFF',
        bgSecondary: '#F3F4F6',
        textBlackColor: '#0C031B',
        textPrimary: '#FFFFFF',
        buttonPrimary: '#35509a',
        buttonHover: '#2b417e',
        blue: {
          600: '#2b417e',
          700: '#2c4383ff',
          800: '#21324eff',
          900: '#1b2b44ff',
        },
      },
      fontSize: {
        h1: ['2.5rem', { lineHeight: '4rem', fontWeight: '700' }], // 40px
        h2: ['2rem', { lineHeight: '3rem', fontWeight: '700' }], // 32px
        h3: ['1.75rem', { lineHeight: '2.25rem', fontWeight: '600' }], // 28px
        h4: ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }], // 24px
        h5: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '500' }], // 20px
        h6: ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }], // 16px
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(to right, #2563eb, #4f46e5)',
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#2b417e',
            },
          },
        },
      },
    }),
  ],
};
