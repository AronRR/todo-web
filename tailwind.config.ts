import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f0f0f',
        surface: '#1a1a1a',
        border: '#2a2a2a',
        primary: '#6366f1',
        text: '#f1f5f9',
        muted: '#94a3b8',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
}
export default config
