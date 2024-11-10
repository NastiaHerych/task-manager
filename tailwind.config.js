/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      minWidth: {
        "30rem": "30rem",
      },
      screens: {
        mobile: { max: "767px" },
        tablet: { min: "768px", max: "1024px" },
        desktop: { min: "768px" },
        "2xl": "1440px",
        "3xl": "1920px",
      },
      colors: {
        chrome: {
          DEFAULT: "#153448",
        },
        navy: {
          DEFAULT: "#3C5B6F",
          light: "#C0CED5",
        },
        brown: {
          DEFAULT: "#948979",
        },
        beige: {
          DEFAULT: "#DFD0B8",
        },
        white: {
          DEFAULT: "#FFFFFF",
        },
        black: {
          DEFAULT: "#000000",
        },
      },
    },
    plugins: [],
  },
};
