// Main App component
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, Text } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './src/contexts/AuthContext';
import { DataProvider } from './src/contexts/DataContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { initRTL } from './src/lib/rtlSetup';
import { setDefaultFont } from './src/lib/fontSetup';
import { initializeUILib } from './src/theme/uilib.config';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Sakkal Majalla': require('./font/majalla.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      console.log('✅ Majalla font loaded successfully');
      // Set the default font for all Text and TextInput components
      setDefaultFont();
      console.log('✅ Default font applied globally');
      
      // Initialize UI Lib theme after font is set
      initializeUILib();
      console.log('✅ UI Lib initialized');
      
      SplashScreen.hideAsync();
    }
    if (fontError) {
      console.error('❌ Font loading error:', fontError);
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // Initialize RTL based on user preference
    initRTL().catch(() => {
      // Ignore errors, app will use default RTL behavior
    });
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DataProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </DataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
