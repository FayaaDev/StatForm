import React from 'react';
import { Button as UIButton, ButtonProps as UIButtonProps } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { DEFAULT_FONT_FAMILY } from '../../theme/typography';

export interface ButtonProps extends Omit<UIButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled,
  style,
  labelStyle,
  ...props
}) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.border;
    switch (variant) {
      case 'primary':
        return COLORS.primary;
      case 'secondary':
        return COLORS.primarySoft;
      case 'danger':
        return COLORS.error;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return COLORS.primary;
    }
  };

  const getLabelColor = () => {
    if (disabled) return COLORS.textMuted;
    switch (variant) {
      case 'primary':
      case 'danger':
        return COLORS.white;
      case 'secondary':
        return COLORS.primary;
      case 'outline':
      case 'ghost':
        return COLORS.primary;
      default:
        return COLORS.white;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 12,
          fontSize: 16,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          fontSize: 21,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 16,
          fontSize: 19,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <UIButton
      backgroundColor={getBackgroundColor()}
      borderRadius={30}
      enableShadow
      disabled={disabled}
      style={[
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        variant === 'outline' && styles.outline,
        style,
      ]}
      labelStyle={[
        {
          color: getLabelColor(),
          fontSize: sizeStyles.fontSize,
          fontWeight: '600',
          fontFamily: DEFAULT_FONT_FAMILY,
        },
        labelStyle,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  outline: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
});
