// Login screen for regional users
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  I18nManager,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { AppLogo } from '../../assets';
import { COLORS } from '../../theme/colors';
import { DEFAULT_FONT_FAMILY } from '../../theme/typography';
import { Button, AppText as Text, AppTextInput as TextInput } from '../../components/ui';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('خطأ', 'الرجاء إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setIsLoading(true);
    try {
      await login({ username: username.trim(), password });
    } catch (error) {
      Alert.alert(
        'خطأ في تسجيل الدخول',
        error instanceof Error ? error.message : 'فشل تسجيل الدخول'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Logo/Header */}
          <View style={styles.header}>
            <Text style={styles.title}>نظام مراقبة الأمراض</Text>
            <Image source={AppLogo} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>اسم المستخدم</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="أدخل اسم المستخدم"
                placeholderTextColor={COLORS.placeholder}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>كلمة المرور</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="أدخل كلمة المرور"
                placeholderTextColor={COLORS.placeholder}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <Button
              label={isLoading ? undefined : "تسجيل الدخول"}
              onPress={handleLogin}
              disabled={isLoading}
              size="large"
              style={styles.button}
            >
              {isLoading && <ActivityIndicator color="#fff" />}
            </Button>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              أحد منتجات هيئة الصحة العامة(وقاية)
            </Text>
            <Text style={styles.footerVersion}>الإصدار 1.0.7</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    gap: 12,
  },
  logo: {
    width: 120,
    height: 54,
  },
  title: {
    fontSize: 33,
    fontWeight: 'bold',
    fontFamily: DEFAULT_FONT_FAMILY,
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 19,
    fontFamily: DEFAULT_FONT_FAMILY,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 19,
    fontWeight: '600',
    fontFamily: DEFAULT_FONT_FAMILY,
    color: COLORS.textPrimary,
    marginBottom: 8,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 19,
    fontFamily: DEFAULT_FONT_FAMILY,
    color: COLORS.textPrimary,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  button: {
    marginTop: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 16,
    fontFamily: DEFAULT_FONT_FAMILY,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  footerVersion: {
    fontSize: 14,
    fontFamily: DEFAULT_FONT_FAMILY,
    color: COLORS.placeholder,
    marginTop: 4,
  },
});

