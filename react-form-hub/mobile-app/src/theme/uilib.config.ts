import { Colors, Typography, Spacings, ThemeManager } from 'react-native-ui-lib';
import { COLORS } from './colors';

/**
 * Initialize react-native-ui-lib theme configuration
 * This should be called once at app startup before rendering any UI Lib components
 */
export const initializeUILib = () => {
  // Configure colors from existing color palette
  Colors.loadColors({
    // Primary colors
    primary: COLORS.primary,
    primaryDark: COLORS.primaryDark,
    primaryMuted: COLORS.primaryMuted,
    primarySoft: COLORS.primarySoft,
    primarySoftAlt: COLORS.primarySoftAlt,

    // Background & Surface
    background: COLORS.background,
    surface: COLORS.surface,

    // Text colors
    textPrimary: COLORS.textPrimary,
    textSecondary: COLORS.textSecondary,
    textMuted: COLORS.textMuted,

    // UI colors
    placeholder: COLORS.placeholder,
    border: COLORS.border,
    white: COLORS.white,
    black: COLORS.black,

    // Status colors
    error: COLORS.error,
    warning: COLORS.warning,
    success: '#22C55E',
    info: '#3B82F6',

    // Semantic aliases for UI Lib components
    $backgroundDefault: COLORS.background,
    $backgroundElevated: COLORS.surface,
    $textDefault: COLORS.textPrimary,
    $textNeutral: COLORS.textSecondary,
    $textDisabled: COLORS.textMuted,
    $iconDefault: COLORS.textSecondary,
    $iconDisabled: COLORS.textMuted,
    $outlineDefault: COLORS.border,
  });

  // Configure typography with Sakkal Majalla font
  Typography.loadTypographies({
    h1: { fontSize: 33, fontWeight: '700', lineHeight: 39, fontFamily: 'Sakkal Majalla' },
    h2: { fontSize: 27, fontWeight: '600', lineHeight: 35, fontFamily: 'Sakkal Majalla' },
    h3: { fontSize: 23, fontWeight: '600', lineHeight: 30, fontFamily: 'Sakkal Majalla' },
    h4: { fontSize: 21, fontWeight: '600', lineHeight: 27, fontFamily: 'Sakkal Majalla' },
    body: { fontSize: 19, fontWeight: '400', lineHeight: 25, fontFamily: 'Sakkal Majalla' },
    bodyBold: { fontSize: 19, fontWeight: '600', lineHeight: 25, fontFamily: 'Sakkal Majalla' },
    bodySmall: { fontSize: 16, fontWeight: '400', lineHeight: 23, fontFamily: 'Sakkal Majalla' },
    bodySmallBold: { fontSize: 16, fontWeight: '600', lineHeight: 23, fontFamily: 'Sakkal Majalla' },
    caption: { fontSize: 14, fontWeight: '400', lineHeight: 19, fontFamily: 'Sakkal Majalla' },
    captionBold: { fontSize: 14, fontWeight: '600', lineHeight: 19, fontFamily: 'Sakkal Majalla' },
    label: { fontSize: 16, fontWeight: '500', lineHeight: 21, fontFamily: 'Sakkal Majalla' },
  });

  // Configure spacings
  Spacings.loadSpacings({
    page: 20,
    card: 16,
    section: 24,
    s1: 4,
    s2: 8,
    s3: 12,
    s4: 16,
    s5: 20,
    s6: 24,
    s7: 32,
    s8: 40,
  });

  // Configure component defaults for RTL support
  ThemeManager.setComponentTheme('Text', {
    style: {
      writingDirection: 'auto',
      fontFamily: 'Sakkal Majalla',
    },
  });

  ThemeManager.setComponentTheme('TextField', {
    style: {
      writingDirection: 'auto',
      textAlign: 'auto',
      fontFamily: 'Sakkal Majalla',
    },
  });

  ThemeManager.setComponentTheme('Button', {
    borderRadius: 8,
  });

  ThemeManager.setComponentTheme('Card', {
    borderRadius: 12,
    enableShadow: true,
  });

  console.log('react-native-ui-lib initialized with custom theme');
};
