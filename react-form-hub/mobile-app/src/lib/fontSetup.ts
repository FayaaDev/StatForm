// @ts-ignore
import { setCustomText, setCustomTextInput } from 'react-native-global-props';

/**
 * Set default font family for all Text and TextInput components
 * This should be called once at app startup
 */
export const setDefaultFont = () => {
  const defaultFontFamily = 'Sakkal Majalla';

  console.log('🔤 Setting default font to:', defaultFontFamily);

  // Set custom props for Text
  const customTextProps = {
    style: {
      fontFamily: defaultFontFamily,
    },
  };

  // Set custom props for TextInput
  const customTextInputProps = {
    style: {
      fontFamily: defaultFontFamily,
    },
  };

  try {
    setCustomText(customTextProps);
    console.log('✅ Custom Text props set');
  } catch (error) {
    console.error('❌ Error setting custom Text props:', error);
  }

  try {
    setCustomTextInput(customTextInputProps);
    console.log('✅ Custom TextInput props set');
  } catch (error) {
    console.error('❌ Error setting custom TextInput props:', error);
  }
};

