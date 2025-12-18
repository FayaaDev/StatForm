import { I18nManager, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';

const LANGUAGE_STORAGE_KEY = '@app_language';

// Allow RTL support but don't force it at initialization
// This enables dynamic RTL/LTR switching based on user preference
I18nManager.allowRTL(true);

export async function initRTL(): Promise<void> {
  // Read stored language preference early
  let preferredLanguage = 'ar'; // Default to Arabic
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && typeof stored === 'string') {
      preferredLanguage = stored;
    }
  } catch (error) {
    // Log error in dev mode for verification
    if (__DEV__) {
      console.log('Could not load language preference:', error);
    }
  }

  const shouldUseRTL = preferredLanguage === 'ar';

  // Log language and RTL state in dev mode for verification
  if (__DEV__) {
    console.log('Language:', preferredLanguage);
    console.log('I18nManager.isRTL:', I18nManager.isRTL);
    console.log('Should use RTL:', shouldUseRTL);
  }

  // Apply runtime direction
  const needsFlip = I18nManager.isRTL !== shouldUseRTL;
  if (needsFlip) {
    try {
      I18nManager.forceRTL(shouldUseRTL);
      
      // On iOS/Android, direction change requires app reload
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // Reload the app to apply direction change
        await Updates.reloadAsync();
      }
    } catch (error) {
      if (__DEV__) {
        console.log('Could not flip RTL direction:', error);
      }
    }
  }

  // Web: set <html dir="...">
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    document.documentElement.dir = shouldUseRTL ? 'rtl' : 'ltr';
  }
}

export function getIsRTL(): boolean {
  return I18nManager.isRTL;
}


