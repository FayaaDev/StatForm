import React from 'react';
import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';
import { DEFAULT_FONT_FAMILY } from '../../theme/typography';

export interface AppTextInputProps extends TextInputProps {
}

/**
 * Custom TextInput component that applies Sakkal Majalla font by default
 */
export const AppTextInput: React.FC<AppTextInputProps> = ({ style, ...props }) => {
  return (
    <RNTextInput style={[styles.default, style]} {...props} />
  );
};

const styles = StyleSheet.create({
  default: {
    fontFamily: DEFAULT_FONT_FAMILY,
  },
});
