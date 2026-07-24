/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Preserved from the original site — do not change the core palette.
        ink: '#0d1013', // primary near-black background (original --color-tertiary)
        'ink-2': '#0a0c0f', // slightly deeper panel
        // Neumorphic card surface + its two shadow tones (adapted from the old
        // --shadow-1 neumorphism onto the darker #0d1013 base).
        surface: '#14181d',
        'surface-2': '#171c22',
        'neu-dark': '#080a0d',
        'neu-light': '#1c2229',
        accent: '#ff014f', // brand pink/red (original --color-primary)
        'accent-2': '#f9004d', // original --color-subtitle
        heading: '#ffffff',
        body: '#878e99', // original --color-body
        lightn: '#c4cfde', // original --color-lightn
        // Space theme
        star: '#e7ecff',
        nebula: '#2a1140',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Fluid typography via clamp()
        'fluid-hero': 'clamp(2.6rem, 6vw + 1rem, 5.25rem)',
        'fluid-h2': 'clamp(1.9rem, 3vw + 0.5rem, 3rem)',
        'fluid-lead': 'clamp(1rem, 0.6vw + 0.9rem, 1.2rem)',
        'fluid-watermark': 'clamp(5rem, 22vw, 20rem)',
      },
      boxShadow: {
        // Neumorphic raised card (the look the user liked from the old site)
        neu: '10px 10px 22px #080a0d, -10px -10px 22px #1c2229',
        'neu-sm': '6px 6px 14px #080a0d, -6px -6px 14px #1c2229',
        'neu-inset': 'inset 6px 6px 12px #080a0d, inset -6px -6px 12px #1c2229',
        glow: '0 0 0 1px rgba(255,1,79,0.28), 0 12px 44px -8px rgba(255,1,79,0.5)',
        'glow-soft': '0 20px 60px -20px rgba(255,1,79,0.4)',
        'neu-glow':
          '10px 10px 22px #080a0d, -10px -10px 22px #1c2229, 0 0 34px -6px rgba(255,1,79,0.45)',
        card: '0 24px 60px -30px rgba(0,0,0,0.9)',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #ff014f 0%, #ff5a86 100%)',
        'radial-fade': 'radial-gradient(60% 60% at 50% 0%, rgba(255,1,79,0.12) 0%, rgba(13,16,19,0) 70%)',
        'nebula-fade':
          'radial-gradient(50% 60% at 20% 10%, rgba(122,40,180,0.18) 0%, rgba(13,16,19,0) 60%), radial-gradient(50% 60% at 85% 20%, rgba(255,1,79,0.12) 0%, rgba(13,16,19,0) 60%)',
        grid: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
      keyframes: {
        'accent-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'accent-pulse': 'accent-pulse 3s ease-in-out infinite',
        marquee: 'marquee 26s linear infinite',
        twinkle: 'twinkle 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
      },
    },
  },
  plugins: [],
};
