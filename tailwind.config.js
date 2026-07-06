/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2937",
        leaf: "#16a34a",
        mint: "#ecfdf5",
        coral: "#fb7185",
        amberSoft: "#fff7ed",
      },
      boxShadow: {
        soft: "0 14px 40px rgba(31, 41, 55, 0.08)",
      },
    },
  },
  plugins: [],
};
