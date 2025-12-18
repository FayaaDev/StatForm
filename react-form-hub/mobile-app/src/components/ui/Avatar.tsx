import React from 'react';
import { Avatar as UIAvatar, AvatarProps as UIAvatarProps } from 'react-native-ui-lib';
import { COLORS } from '../../theme/colors';

export interface AvatarProps extends Omit<UIAvatarProps, 'size'> {
  size?: 'small' | 'medium' | 'large' | number;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'medium',
  name,
  source,
  ...props
}) => {
  const getSize = (): number => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'small':
        return 32;
      case 'large':
        return 64;
      default:
        return 48;
    }
  };

  return (
    <UIAvatar
      size={getSize()}
      name={name}
      source={source}
      backgroundColor={COLORS.primarySoft}
      labelColor={COLORS.primary}
      {...props}
    />
  );
};
