import React from 'react';
import { TextField as UITextField } from 'react-native-ui-lib';
import { StyleSheet, StyleProp, TextStyle } from 'react-native';
import { COLORS } from '../../theme/colors';

export interface TextInputProps {
  error?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
}

export const TextInput: React.FC<TextInputProps> = ({
  error,
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  editable,
  multiline,
  numberOfLines,
  style,
}) => {
  return (
    <UITextField
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      editable={editable}
      multiline={multiline}
      numberOfLines={numberOfLines}
      floatingPlaceholder
      floatingPlaceholderColor={{
        default: COLORS.textMuted,
        focus: COLORS.primary,
        error: COLORS.error,
      }}
      fieldStyle={styles.field}
      style={[styles.input, style]}
      labelStyle={styles.label}
      enableErrors
      validationMessage={error}
      validationMessageStyle={styles.error}
    />
  );
};

const styles = StyleSheet.create({
  field: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  input: {
    fontSize: 17,
    color: COLORS.textPrimary,
    writingDirection: 'auto',
    textAlign: 'auto',
  },
  label: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  error: {
    fontSize: 13,
    color: COLORS.error,
    marginTop: 4,
  },
});
