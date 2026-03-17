/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      colors: {
        "apple-gray": "#f5f5f7",
        "apple-gray-light": "#fbfbfd",
        "apple-text": "#1d1d1f",
        "apple-secondary": "#6e6e73",
        "apple-border": "rgba(0,0,0,0.08)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        "apple": "0 2px 12px 0 rgba(0,0,0,0.06), 0 1px 3px 0 rgba(0,0,0,0.04)",
        "apple-hover": "0 8px 30px 0 rgba(0,0,0,0.10), 0 2px 8px 0 rgba(0,0,0,0.06)",
        "apple-modal": "0 25px 60px 0 rgba(0,0,0,0.20)",
      },
      backdropBlur: {
        "xs": "4px",
      },
    },
  },
  plugins: [],
};
