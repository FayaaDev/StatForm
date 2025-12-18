import React from 'react';
import { Checkbox as UICheckbox, CheckboxProps as UICheckboxProps } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export interface CheckboxProps extends UICheckboxProps {
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  value,
  onValueChange,
  disabled,
  ...props
}) => {
  return (
    <UICheckbox
      label={label}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      color={COLORS.primary}
      iconColor={COLORS.white}
      labelStyle={[styles.label, disabled && styles.labelDisabled]}
      containerStyle={styles.container}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 19,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  labelDisabled: {
    color: COLORS.textMuted,
  },
});
