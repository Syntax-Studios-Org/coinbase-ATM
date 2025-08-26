import { useTheme } from '@/providers/ThemeProvider';
import { getThemeVar } from '@/config/theme';
import type { ThemeColors } from '@/config/theme';

/**
 * Hook to get theme-aware styles
 */
export const useThemeStyles = () => {
  const { theme } = useTheme();

  // Helper function to get CSS variable reference
  const getVar = (key: keyof ThemeColors): string => getThemeVar(key);

  // Common style objects using theme variables
  const styles = {
    // Primary button styles
    primaryButton: {
      backgroundColor: getVar('buttonPrimary'),
      color: getVar('textPrimary'),
      '&:hover': {
        backgroundColor: getVar('buttonPrimaryHover'),
      },
    },

    // Secondary button styles
    secondaryButton: {
      backgroundColor: 'transparent',
      border: `1px solid ${getVar('buttonSecondary')}`,
      color: getVar('textAccent'),
      '&:hover': {
        borderColor: getVar('buttonSecondaryHover'),
        backgroundColor: `${getVar('buttonSecondaryHover')}10`,
      },
    },

    // Input styles
    input: {
      backgroundColor: getVar('inputBackground'),
      border: `1px solid ${getVar('inputBorder')}`,
      color: getVar('textPrimary'),
      '&::placeholder': {
        color: getVar('inputPlaceholder'),
      },
    },

    // Card styles
    card: {
      background: theme.cardBackground,
      border: `1px solid ${getVar('borderAccent')}`,
    },

    // Text styles
    text: {
      primary: { color: getVar('textPrimary') },
      secondary: { color: getVar('textSecondary') },
      muted: { color: getVar('textMuted') },
      accent: { color: getVar('textAccent') },
      error: { color: getVar('textError') },
    },

    // Gradient styles
    gradients: {
      welcome: `linear-gradient(to right, ${getVar('welcomeGradientStart')}, ${getVar('welcomeGradientEnd')})`,
      card: `linear-gradient(103.02deg, ${getVar('cardGradientStart')} 0%, ${getVar('cardGradientEnd')} 101.44%)`,
    },
  };

  return {
    theme,
    getVar,
    styles,
  };
};