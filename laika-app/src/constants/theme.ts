// src/constants/theme.ts
export const colors = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  
  secondary: '#10B981',
  accent: '#F59E0B',
  
  background: '#FFFFFF',
  surface: '#F3F4F6',
  
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  
  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  
  border: '#E5E7EB',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    lineHeight: 16,
  },
};

export const theme = {
  colors,
  spacing,
  typography,
};

export default theme;
