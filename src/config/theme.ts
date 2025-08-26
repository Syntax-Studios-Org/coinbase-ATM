export interface ThemeColors {
  // Primary brand colors
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Card and surface colors
  cardBackground: string;
  cardBorder: string;
  cardGradientStart: string;
  cardGradientEnd: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textAccent: string;
  textError: string;
  
  // Border colors
  borderPrimary: string;
  borderSecondary: string;
  borderAccent: string;
  borderError: string;
  
  // Button colors
  buttonPrimary: string;
  buttonPrimaryHover: string;
  buttonSecondary: string;
  buttonSecondaryHover: string;
  
  // Input colors
  inputBackground: string;
  inputBorder: string;
  inputPlaceholder: string;
  
  // Gradient colors
  gradientStart: string;
  gradientEnd: string;
  welcomeGradientStart: string;
  welcomeGradientEnd: string;
  
  // Modal and overlay colors
  modalBackground: string;
  modalBorder: string;
  overlayBackground: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
}

export const defaultTheme: ThemeColors = {
  // Primary brand colors - main green theme
  primary: '#2bc876',
  primaryHover: '#25b369',
  primaryLight: '#2bc87638',
  primaryDark: '#102319',
  
  // Background colors
  background: '#464c4d',
  backgroundSecondary: '#141519',
  backgroundTertiary: '#091408',
  
  // Card and surface colors
  cardBackground: 'radial-gradient(50% 294.9% at 50% 50%, #09140E 0%, #050A07 100%)',
  cardBorder: 'linear-gradient(103.02deg, #1E1E1E 0%, #3D3C3C 101.44%)',
  cardGradientStart: '#1E1E1E',
  cardGradientEnd: '#3D3C3C',
  
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#ffffff80', // white/50
  textMuted: '#ffffff60', // white/60
  textAccent: '#2ac876',
  textError: '#DF6A70',
  
  // Border colors
  borderPrimary: '#ffffff20', // white/20
  borderSecondary: '#ffffff10', // white/10
  borderAccent: '#2bc87638',
  borderError: '#DF6A70',
  
  // Button colors
  buttonPrimary: '#2ac876',
  buttonPrimaryHover: '#25b369',
  buttonSecondary: '#2bc87638',
  buttonSecondaryHover: '#2bc876',
  
  // Input colors
  inputBackground: '#141519',
  inputBorder: '#2bc87638',
  inputPlaceholder: '#ffffff40', // white/40
  
  // Gradient colors
  gradientStart: '#2bc876',
  gradientEnd: '#2bc87682',
  welcomeGradientStart: '#2bc876',
  welcomeGradientEnd: '#2bc87682',
  
  // Modal and overlay colors
  modalBackground: 'linear-gradient(to right, #091408, #050a07)',
  modalBorder: '#2bc87638',
  overlayBackground: 'radial-gradient(50% 294.9% at 50% 50%, rgba(9, 20, 14, 0.7) 0%, rgba(5, 10, 7, 0.7) 100%)',
  
  // Status colors
  success: '#2bc876',
  warning: '#f59e0b',
  error: '#DF6A70',
  info: '#3b82f6',
};

// Theme context and provider will be added here
export type Theme = ThemeColors;

// Helper function to convert theme colors to CSS custom properties
export const themeToCSSProperties = (theme: ThemeColors): Record<string, string> => {
  const cssProperties: Record<string, string> = {};
  
  Object.entries(theme).forEach(([key, value]) => {
    // Convert camelCase to kebab-case and add -- prefix
    const cssKey = `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    cssProperties[cssKey] = value;
  });
  
  return cssProperties;
};

// Helper function to get CSS variable reference
export const getThemeVar = (key: keyof ThemeColors): string => {
  const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
  return `var(--theme-${cssKey})`;
};