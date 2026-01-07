// app/auth/login.tsx
import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { colors, spacing, typography } from '../../src/constants/theme';
import { signIn } from '../../src/services/authService';
import { getUserProfile, getVetProfile, getShelterProfile } from '../../src/services/apiService';
import { loginSuccess } from '../../src/store/slices/authSlice';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Authenticate with Cognito
      const result = await signIn({ username, password });
      const idToken = result.getIdToken();
      const userId = idToken.payload.sub;

      console.log('✅ Cognito authentication successful, userId:', userId);

      // 2. Check if user profile exists via API
      let userProfile;
      try {
        userProfile = await getUserProfile();
      } catch (error: any) {
        if (error.message.includes('not found')) {
          // First-time login - profile doesn't exist yet
          console.log('ℹ️ No profile found, redirecting to complete profile');
          
          dispatch(loginSuccess({
            userId,
            email: idToken.payload.email,
            isAuthenticated: true,
            needsProfileSetup: true,
          }));
          
          router.push('/complete-profile');
          return;
        }
        throw error;
      }

      console.log('✅ User profile found:', userProfile);

      // 3. Load role-specific data
      let roleProfile = null;

      if (userProfile.role === 'vet') {
        roleProfile = await getVetProfile(userId);
        console.log('✅ Vet profile loaded:', roleProfile);
        
      } else if (userProfile.role === 'shelter') {
        roleProfile = await getShelterProfile(userId);
        console.log('✅ Shelter profile loaded:', roleProfile);
      }

      // 4. Save to Redux
      dispatch(loginSuccess({
        userId,
        email: userProfile.email,
        role: userProfile.role,
        isAuthenticated: true,
        needsProfileSetup: false,
        userProfile,
        roleProfile,
      }));

      // 5. Navigate to home (dashboards will be created later)
      router.replace('/');

      Alert.alert('Success', 'Welcome back!');

    } catch (error: any) {
      console.error('❌ Login error:', error);
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to Laika</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon 
                icon={showPassword ? "eye-off" : "eye"} 
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.loginButton}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <Text style={styles.signupLink}>Sign Up</Text>
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
  },
  titleContainer: {
    marginBottom: spacing.xl,
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
  form: {
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
  },
  loginButton: {
    marginTop: spacing.lg,
    borderRadius: 8,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  signupText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  signupLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});
