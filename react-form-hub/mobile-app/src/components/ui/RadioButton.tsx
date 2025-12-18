import React from 'react';
import { RadioButton as UIRadioButton, RadioButtonProps as UIRadioButtonProps, View, Text } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export interface RadioButtonProps extends UIRadioButtonProps {
  label?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  selected,
  onPress,
  disabled,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <UIRadioButton
        selected={selected}
        onPress={onPress}
        disabled={disabled}
        color={COLORS.primary}
        {...props}
      />
      {label && (
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      )}
    </View>
  );
};

export interface RadioGroupProps {
  options: Array<{ label: string; value: string }>;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  horizontal?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  disabled,
  horizontal = false,
}) => {
  return (
    <View style={[styles.group, horizontal && styles.groupHorizontal]}>
      {options.map((option) => (
        <RadioButton
          key={option.value}
          label={option.label}
          selected={value === option.value}
          onPress={() => onChange?.(option.value)}
          disabled={disabled}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontSize: 17,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  labelDisabled: {
    color: COLORS.textMuted,
  },
  group: {
    flexDirection: 'column',
  },
  groupHorizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
});
