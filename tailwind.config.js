/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#16213e",
        foreground: "#ffffff",
        card: "#1a1a2e",
        "card-foreground": "#ffffff",
        primary: "#e94560",
        "primary-foreground": "#ffffff",
        secondary: "#0f3460",
        "secondary-foreground": "#ffffff",
        muted: "#8b8b8b",
        "muted-foreground": "#8b8b8b",
        accent: "#e94560",
        "accent-foreground": "#ffffff",
        destructive: "#dc2626",
        "destructive-foreground": "#ffffff",
        border: "#0f3460",
        input: "#0f3460",
        ring: "#e94560",
      },
    },
  },
  plugins: [],
};
