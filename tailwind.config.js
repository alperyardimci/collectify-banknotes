/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#14161E",
        surface: "#1E2030",
        "surface-light": "#282A3A",
        accent: "#D4A843",
        "accent-dark": "#B8922F",
        "accent-glow": "rgba(212, 168, 67, 0.12)",
        "text-primary": "#F0EBE3",
        "text-secondary": "#8B8D9E",
        "text-muted": "#555770",
        success: "#4CAF82",
        danger: "#E85D5D",
        border: "#2A2C3E",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      fontSize: {
        display: ["32px", { lineHeight: "40px", fontWeight: "300" }],
        h1: ["24px", { lineHeight: "32px", fontWeight: "300" }],
        h2: ["20px", { lineHeight: "28px", fontWeight: "400" }],
        h3: ["16px", { lineHeight: "24px", fontWeight: "500" }],
        body: ["14px", { lineHeight: "20px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};
