import React from 'react';
import { View, LoaderScreen } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <LoaderScreen
        message={message}
        color={COLORS.primary}
        backgroundColor={COLORS.background}
        messageStyle={styles.message}
      />
    );
  }

  return (
    <View style={styles.container}>
      <LoaderScreen
        message={message}
        color={COLORS.primary}
        messageStyle={styles.message}
        overlay={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
});
