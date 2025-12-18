import { TextStyle } from 'react-native';

/**
 * Default font family for the app
 */
export const DEFAULT_FONT_FAMILY = 'Sakkal Majalla';

/**
 * Text style presets with Majalla font
 */
export const textStyles = {
  h1: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 33,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 39,
  },
  h2: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 27,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 35,
  },
  h3: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 23,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 30,
  },
  h4: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 21,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 27,
  },
  body: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 19,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 25,
  },
  bodyBold: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 19,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 25,
  },
  bodySmall: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 23,
  },
  bodySmallBold: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 23,
  },
  caption: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 19,
  },
  captionBold: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 19,
  },
  label: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 16,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 21,
  },
};

/**
 * Helper to add default font to any text style
 */
export const withFont = (style?: TextStyle): TextStyle => ({
  fontFamily: DEFAULT_FONT_FAMILY,
  ...style,
});
