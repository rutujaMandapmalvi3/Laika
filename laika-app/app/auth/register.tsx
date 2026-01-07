// app/auth/register.tsx
import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button, RadioButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../src/constants/theme';
import { signUp } from '../../src/services/authService';
import { UserRole } from '../../src/types';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [givenName, setGivenName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [preferredUsername, setPreferredUsername] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.OWNER);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!email || !password || !familyName || !givenName || !phoneNumber || !preferredUsername) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    // Validate phone number format (E.164 format required by Cognito)
    if (!phoneNumber.startsWith('+')) {
      Alert.alert('Error', 'Phone number must start with + and country code (e.g., +1234567890)');
      return;
    }

    setIsLoading(true);

    try {
      await signUp({
        email,
        password,
        firstName: givenName,
        lastName: familyName,
        phoneNumber,
        username: preferredUsername,
        role,
      });

    Alert.alert(
      'Success!',
      'Account created! Please check your email for verification code.',
      [
        {
          text: 'OK',
          onPress: () => router.push({
            pathname: '/auth/verify-email',
            params: { username: preferredUsername }
          }),
        },
      ]
    );
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Registration Failed', error.message || 'Could not create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Laika and connect with pet care</Text>
        </View>

        {/* Role Selection */}
        <View style={styles.roleContainer}>
          <Text style={styles.sectionTitle}>I am a:</Text>
          <RadioButton.Group onValueChange={(value) => setRole(value as UserRole)} value={role}>
            <TouchableOpacity 
              style={styles.radioOption}
              onPress={() => setRole(UserRole.OWNER)}
            >
              <RadioButton value={UserRole.OWNER} color={colors.primary} />
              <Text style={styles.radioLabel}>Pet Owner</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.radioOption}
              onPress={() => setRole(UserRole.VET)}
            >
              <RadioButton value={UserRole.VET} color={colors.primary} />
              <Text style={styles.radioLabel}>Veterinarian</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.radioOption}
              onPress={() => setRole(UserRole.SHELTER)}
            >
              <RadioButton value={UserRole.SHELTER} color={colors.primary} />
              <Text style={styles.radioLabel}>Animal Shelter</Text>
            </TouchableOpacity>
          </RadioButton.Group>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            label="Email *"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Username *"
            value={preferredUsername}
            onChangeText={setPreferredUsername}
            mode="outlined"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Given Name (First Name) *"
            value={givenName}
            onChangeText={setGivenName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Family Name (Last Name) *"
            value={familyName}
            onChangeText={setFamilyName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Phone Number *"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            placeholder="+1234567890"
            helperText="Must include country code (e.g., +1 for US)"
          />

          <TextInput
            label="Password *"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
            helperText="Minimum 8 characters"
          />

          <TextInput
            label="Confirm Password *"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry={!showConfirmPassword}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            style={styles.input}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={isLoading}
          disabled={isLoading}
          style={styles.registerButton}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  titleContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  roleContainer: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  radioLabel: {
    ...typography.body,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  form: {
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
  },
  registerButton: {
    marginTop: spacing.lg,
    borderRadius: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});