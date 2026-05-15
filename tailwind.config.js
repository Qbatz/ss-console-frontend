// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['Inter', 'sans-serif'],
//         gilroy: ['Gilroy', 'sans-serif'],
//       },

//       colors: {
//         primarySoft: "#1E45E10D",
//       },

//       keyframes: {
//         fadeIn: {
//           "0%": { opacity: "0", transform: "translateY(10px)" },
//           "100%": { opacity: "1", transform: "translateY(0px)" },
//         },
//       },

//       animation: {
//         fadeIn: "fadeIn 0.25s ease-out",
//       },
//     },
//   },
//   plugins: [],
// };

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        gilroy: ["Gilroy", "sans-serif"],
      },

      colors: {
        primarySoft: "#1E45E10D",

        borderSoft: "#E6E8F0",
        bgSoft: "#0c0cc6",
        textDark: "#1D1D1D",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
      },

      animation: {
        fadeIn: "fadeIn 0.25s ease-out",
      },
    },
  },

  plugins: [],
};
