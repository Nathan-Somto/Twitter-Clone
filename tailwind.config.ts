import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
const config: Config = {
  darkMode:['class'] ,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens:{
        'xl':'1200px'
      },
      colors:{
        primaryBlack: '#000000',
        dark1: '#0A0A0A',
        dark2: '#121212',
        dark3: '#1A1A1A',
        dark4: '#222222',
        light1: '#5B7083',
        light2: '#8899A6',
        light3: '#EBEEF0',
        light4: '#F7F9FA',
        primaryBlue: '#1DA1F2',
        primaryWhite: '#fff'
      },
      
      keyframes: {
        "accordion-down": {
          from: { height: '0'},
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: '0'},
        },  
          "pulsing": {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.2)' },
          },
          "scale-up": {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.5)' },
          },
          'scale-down':{
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(0.8)' },
          }

      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulsing": "pulsing 1.2s ease-out infinite",
        "scale-up":"scale-up 0.45s ease-in-out",
        "scale-down":"scale-down 0.45s ease-in-out"
      },
  },
  },
  plugins: [require("tailwindcss-animate"),
],
}
export default config
