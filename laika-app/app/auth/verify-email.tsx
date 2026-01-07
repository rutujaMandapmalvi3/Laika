// app/auth/verify-email.tsx
import { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, typography } from '../../src/constants/theme';
import { confirmSignUp, resendConfirmationCode } from '../../src/services/authService';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const username = params.username as string;

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter verification code');
      return;
    }

    setIsLoading(true);

    try {
      await confirmSignUp(username, code);
      
      Alert.alert(
        'Success!',
        'Email verified! You can now sign in.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/auth/login'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Verification error:', error);
      Alert.alert('Verification Failed', error.message || 'Invalid code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      await resendConfirmationCode(username);
      Alert.alert('Success', 'Verification code sent to your email');
    } catch (error: any) {
      console.error('Resend error:', error);
      Alert.alert('Error', error.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to your email address.
        </Text>

        <TextInput
          label="Verification Code"
          value={code}
          onChangeText={setCode}
          mode="outlined"
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
          autoFocus
        />

        <Button
          mode="contained"
          onPress={handleVerify}
          loading={isLoading}
          disabled={isLoading}
          style={styles.verifyButton}
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>

        <Button
          mode="text"
          onPress={handleResendCode}
          loading={isResending}
          disabled={isResending}
          style={styles.resendButton}
        >
          {isResending ? 'Sending...' : 'Resend Code'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  input: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  verifyButton: {
    width: '100%',
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  resendButton: {
    marginTop: spacing.sm,
  },
});
