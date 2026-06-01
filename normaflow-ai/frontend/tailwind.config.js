/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#10233f",
        ink: "#18283f",
        teal: "#167b79",
        mist: "#f4f7f9",
      },
      boxShadow: {
        panel: "0 10px 32px rgba(15, 35, 63, 0.07)",
      },
    },
  },
  plugins: [],
};
