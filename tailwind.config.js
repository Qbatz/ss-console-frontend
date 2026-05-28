/** @type {import('tailwindcss').Config} */
export default {

  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {

      colors: {
        cardBg: "#F6F8FC",
        borderSoft: "#E6E8F0",
        headingDark: "#1F2937",
        primaryBlue: "#2563EB",
      },

      spacing: {
        pageX: "8px",
      },

      borderRadius: {
        card: "12px",
      },

      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08)",
      },

      fontSize: {
        pageTitle: "20px",
      },

      lineHeight: {
        pageTitle: "48px",
      },

      fontFamily: {
        gilroy: ["Gilroy", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },

    },
  },

  plugins: [],
};