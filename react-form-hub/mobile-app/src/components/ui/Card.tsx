import React from 'react';
import { Card as UICard, View, Text } from 'react-native-ui-lib';
import { StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../theme/colors';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  cardPadding?: number;
  noPadding?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  cardPadding = 16,
  noPadding = false,
  onPress,
  style,
}) => {
  const cardStyle: ViewStyle = {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    ...(noPadding ? {} : { padding: cardPadding }),
  };

  return (
    <UICard
      style={[cardStyle, style]}
      enableShadow
      onPress={onPress}
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      {children}
    </UICard>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 19,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
});
