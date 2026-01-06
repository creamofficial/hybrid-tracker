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
        // Kaizen Design System
        background: "#FFFFFF",
        foreground: "#1A1A1A",
        card: "#FFFFFF",
        "card-foreground": "#1A1A1A",
        primary: "#FF6B35",
        "primary-foreground": "#FFFFFF",
        secondary: "#F5F1E8",
        "secondary-foreground": "#1A1A1A",
        muted: "#4A4A4A",
        "muted-foreground": "#4A4A4A",
        accent: "#10B981",
        "accent-foreground": "#FFFFFF",
        destructive: "#dc2626",
        "destructive-foreground": "#FFFFFF",
        border: "#E8E8E8",
        input: "#E8E8E8",
        ring: "#FF6B35",
      },
      spacing: {
        // Consistent spacing scale
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '32px',
        'xl': '48px',
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'small': '8px',
      },
      fontFamily: {
        poppins: ['Poppins_400Regular'],
        'poppins-medium': ['Poppins_500Medium'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
      },
    },
  },
  plugins: [],
};
