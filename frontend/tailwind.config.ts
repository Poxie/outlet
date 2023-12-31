import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './modals/**/*.{js,ts,jsx,tsx,mdx}',
    './popouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: '#D62717',
        secondary: '#E32413',
        light: '#fff',
        'light-secondary': '#F1F1F5',
        'light-tertiary': '#DDDDDD',
      },
      textColor: {
        'c-primary': '#FF5151',
        primary: '#202124',
        secondary: '#606060',
        light: '#fff',
        'light-secondary': '#ffdada',
        danger: '#D62717',
      },
      borderColor: {
        light: '#fff',
        'light-secondary': '#F1F1F5',
        'light-tertiary': '#DDDDDD',
        'c-primary': '#D62717',
        'c-secondary': '#E32413',
      },
      boxShadow: {
        navbar: '0px 1px 2px 0px rgb(0 0 0 / 15%)',
        footer: '0px -1px 2px 0px rgb(0 0 0 / 15%)',
        centered: '0px 0px 4px 1px rgb(0 0 0 / 10%)',
      },
      width: {
        main: '1100px',
      },
      maxWidth: {
        main: '90%',
      },
    },
  },
  plugins: [],
}
export default config
