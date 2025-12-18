// Root navigator
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { TemplateListScreen } from '../screens/templates/TemplateListScreen';
import { FillFormScreen } from '../screens/templates/FillFormScreen';
import { CaseListScreen } from '../screens/cases/CaseListScreen';
import { CaseDetailScreen } from '../screens/cases/CaseDetailScreen';
import { CaseVersionHistoryScreen } from '../screens/cases/CaseVersionHistoryScreen';
import { CaseVersionDetailScreen } from '../screens/cases/CaseVersionDetailScreen';
import { ActivityIndicator, View, StyleSheet, TouchableOpacity, Image, I18nManager } from 'react-native';
import { COLORS } from '../theme/colors';
import { DEFAULT_FONT_FAMILY } from '../theme/typography';
import { AppLogo } from '../assets';
import { AppText as Text } from '../components/ui';

const Stack = createStackNavigator();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();

  // Convert to explicit boolean to avoid React Native type issues
  const loading = Boolean(isLoading);
  const authenticated = Boolean(isAuthenticated);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!authenticated ? (
        <Stack.Navigator screenOptions={{ headerShown: false as any }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.primary,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600' as any,
              fontFamily: DEFAULT_FONT_FAMILY,
            },
            headerBackTitleStyle: {
              fontFamily: DEFAULT_FONT_FAMILY,
            },
            headerTitleAlign: 'center' as any,
            headerBackImage: ({ tintColor }) => (
              <Text style={{ color: tintColor, fontSize: 25, marginHorizontal: 12, fontFamily: DEFAULT_FONT_FAMILY }}>
                {I18nManager.isRTL ? '\u203A' : '\u2039'}
              </Text>
            ),
          }}
        >
          <Stack.Screen
            name="TemplateList"
            component={TemplateListScreen}
            options={{
              title: 'النماذج المتاحة',
              headerLeft: () => (
                <Image source={AppLogo} style={styles.headerLogo} resizeMode="contain" />
              ),
              headerRight: () => (
                <View style={styles.headerActions}>
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={logout}
                  >
                    <Text style={styles.logoutText}>خروج</Text>
                  </TouchableOpacity>
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="FillForm"
            component={FillFormScreen}
            options={{
              title: 'ملء النموذج',
            }}
          />
          <Stack.Screen
            name="CaseList"
            component={CaseListScreen}
            options={{
              title: 'إدارة الحالات',
            }}
          />
          <Stack.Screen
            name="CaseDetail"
            component={CaseDetailScreen}
            options={{
              title: 'تفاصيل الحالة',
            }}
          />
          <Stack.Screen
            name="CaseVersionHistory"
            component={CaseVersionHistoryScreen}
            options={{
              title: 'سجل النسخ',
            }}
          />
          <Stack.Screen
            name="CaseVersionDetail"
            component={CaseVersionDetailScreen}
            options={{
              title: 'تفاصيل النسخة',
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  headerLogo: {
    width: 80,
    height: 36,
    marginTop: -4,
    marginStart: 16,
  },
  headerActions: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    gap: 8,
    marginEnd: 16,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: DEFAULT_FONT_FAMILY,
  },
});

