import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { DEFAULT_FONT_FAMILY } from '../../theme/typography';

export interface AppTextProps extends TextProps {
  children?: React.ReactNode;
}

/**
 * Custom Text component that applies Sakkal Majalla font by default
 */
export const AppText: React.FC<AppTextProps> = ({ style, children, ...props }) => {
  return (
    <RNText style={[styles.default, style]} {...props}>
      {children}
    </RNText>
  );
};

// Alias for convenience
export const Text = AppText;

const styles = StyleSheet.create({
  default: {
    fontFamily: DEFAULT_FONT_FAMILY,
  },
});
