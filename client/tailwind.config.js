/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          50: '#f0ebff',
          100: '#e0d5ff',
          200: '#c1abff',
          300: '#a381ff',
          400: '#8457ff',
          500: '#6C47FF',
          600: '#5534e0',
          700: '#3f22b8',
          800: '#2a1590',
          900: '#160a68',
        },
        dark: {
          50: '#f8f8fc',
          100: '#eeeef8',
          200: '#d5d5ea',
          300: '#b4b4d4',
          400: '#8888b8',
          500: '#6666a0',
          600: '#4a4a7e',
          700: '#2d2d5a',
          800: '#1a1a3a',
          850: '#131326',
          900: '#0c0c1d',
          950: '#07070f',
        },
        surface: {
          DEFAULT: '#13132a',
          light: '#1e1e3f',
          lighter: '#252548',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6C47FF 0%, #a855f7 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0c0c1d 0%, #13132a 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(108,71,255,0.1) 0%, rgba(168,85,247,0.05) 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(108,71,255,0.3) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(108, 71, 255, 0.4)',
        'glow-lg': '0 0 40px rgba(108, 71, 255, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'typing': 'typing 0.05s steps(1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108, 71, 255, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(108, 71, 255, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
