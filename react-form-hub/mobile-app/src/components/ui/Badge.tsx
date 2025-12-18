import React from 'react';
import { Chip as UIChip } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium';
  label?: string;
  onPress?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'medium',
  label,
  onPress,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: COLORS.primarySoft, text: COLORS.primary };
      case 'secondary':
        return { bg: COLORS.background, text: COLORS.textSecondary };
      case 'success':
        return { bg: '#DCFCE7', text: '#16A34A' };
      case 'warning':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'error':
        return { bg: '#FEE2E2', text: '#DC2626' };
      case 'info':
        return { bg: '#DBEAFE', text: '#2563EB' };
      default:
        return { bg: COLORS.primarySoft, text: COLORS.primary };
    }
  };

  const colors = getColors();

  return (
    <UIChip
      label={label}
      backgroundColor={colors.bg}
      labelStyle={[
        styles.label,
        { color: colors.text },
        size === 'small' && styles.labelSmall,
      ]}
      containerStyle={[
        styles.container,
        size === 'small' && styles.containerSmall,
      ]}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  containerSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  labelSmall: {
    fontSize: 14,
  },
});
