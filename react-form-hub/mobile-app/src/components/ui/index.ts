// UI Components using react-native-ui-lib
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Card } from './Card';
export type { CardProps } from './Card';

export { TextInput } from './TextInput';
export type { TextInputProps } from './TextInput';

export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { RadioButton, RadioGroup } from './RadioButton';
export type { RadioButtonProps, RadioGroupProps } from './RadioButton';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Avatar } from './Avatar';
export type { AvatarProps } from './Avatar';

export { Loading } from './Loading';
export type { LoadingProps } from './Loading';

// Custom Text and TextInput with Sakkal Majalla font
export { AppText, Text as AppTextComponent } from './AppText';
export type { AppTextProps } from './AppText';
export { AppTextInput } from './AppTextInput';
export type { AppTextInputProps } from './AppTextInput';

// Re-export commonly used UI Lib components for convenience
export {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dialog,
  Modal,
  Toast,
  ActionSheet,
  Picker,
  Switch,
  Slider,
  ProgressBar,
  Stepper,
  TabController,
  Carousel,
  ExpandableSection,
  Fader,
  GridList,
  SortableList,
  AnimatedImage,
  AnimatedScanner,
  FloatingButton,
  FeatureHighlight,
  Hint,
  WheelPicker,
  DateTimePicker,
  ColorPicker,
  ColorSwatch,
  Drawer,
  StackAggregator,
  Wizard,
} from 'react-native-ui-lib';

// Re-export Colors, Typography, Spacings for easy access
export { Colors, Typography, Spacings, Assets, ThemeManager } from 'react-native-ui-lib';
