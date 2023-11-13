import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: '#D62717',
        secondary: '#E32413'
      },
      textColor: {
        light: '#fff',
        'light-secondary': '#ffdada',
      },
      borderColor: {
        light: '#fff',
      },
      width: {
        main: '1000px',
      },
      maxWidth: {
        main: '90%',
      }
    },
  },
  plugins: [],
}
export default config
