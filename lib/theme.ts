// Kaizen Design System - Design Tokens

export const colors = {
  // Primary Accent (use as gradient endpoints)
  primary: {
    start: '#FF8A00',
    end: '#FFB347',
    solid: '#FF8A00',
  },

  // Backgrounds
  background: '#FDF8F5', // Warm off-white
  card: '#FFFFFF',

  // Text
  text: {
    primary: '#1A1A1A',
    secondary: 'rgba(26, 26, 26, 0.6)',
    tertiary: 'rgba(26, 26, 26, 0.4)',
    inverse: '#FFFFFF',
  },

  // Semantic colors
  success: '#7ED957',
  error: '#DC2626',
  warning: '#EAB308',

  // Accent backgrounds (for icon containers)
  accent: {
    orange: { bg: '#FEF3E7', icon: '#FF8A00' },
    green: { bg: '#E6F7F2', icon: '#10B981' },
    purple: { bg: '#F3E8FF', icon: '#8B5CF6' },
    blue: { bg: '#E0F2FE', icon: '#0EA5E9' },
    pink: { bg: '#FCE7F3', icon: '#EC4899' },
    yellow: { bg: '#FEF9C3', icon: '#EAB308' },
    amber: { bg: '#FEF3C7', icon: '#F59E0B' },
  },

  // Borders
  border: '#E8E8E8',
  borderLight: 'rgba(0, 0, 0, 0.06)',
};

export const shadows = {
  // Standard cards
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // Elevated cards (hero/featured)
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },

  // Subtle shadow for buttons
  button: {
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  // No shadow
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};

export const typography = {
  // Hero numbers (XP, main stats)
  hero: {
    fontSize: 40,
    fontWeight: '700' as const,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 48,
  },

  // Card stat numbers
  stat: {
    fontSize: 32,
    fontWeight: '700' as const,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 40,
  },

  // Medium stat numbers
  statMedium: {
    fontSize: 28,
    fontWeight: '700' as const,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 34,
  },

  // Section headers
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600' as const,
    fontFamily: 'Poppins_600SemiBold',
    lineHeight: 24,
  },

  // Card titles
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: 'Poppins_600SemiBold',
    lineHeight: 22,
  },

  // Body text
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
  },

  // Labels/captions
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 18,
  },

  // Small text
  small: {
    fontSize: 11,
    fontWeight: '400' as const,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 14,
  },

  // Button text
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: 'Poppins_600SemiBold',
    lineHeight: 22,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
};

// Icon container sizes
export const iconContainer = {
  sm: { size: 32, radius: 8 },
  md: { size: 40, radius: 10 },
  lg: { size: 48, radius: 12 },
  xl: { size: 56, radius: 14 },
};

// Gradient configurations for expo-linear-gradient
export const gradients = {
  primary: {
    colors: ['#FF8A00', '#FFB347'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  primarySubtle: {
    colors: ['rgba(255, 138, 0, 0.08)', 'rgba(255, 179, 71, 0.04)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  success: {
    colors: ['#7ED957', '#A3E635'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};
