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
      colors:{
        primaryBlack : '#0F1419',
        dark1: '#17202A',
        dark2: '#1C2733',
        dark3: '#283340',
        dark4: '#3A444C',
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
  },
  },
  plugins: [require("tailwindcss-animate"),
],
}
export default config
