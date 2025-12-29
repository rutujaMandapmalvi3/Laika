// app/index.tsx
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Import theme constants
const colors = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  secondary: '#10B981',
  accent: '#F59E0B',
  background: '#FFFFFF',
  surface: '#F3F4F6',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    lineHeight: 16,
  },
};

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Surface style={styles.logoCircle} elevation={2}>
            <Ionicons name="paw" size={64} color={colors.primary} />
          </Surface>
        </View>

        <Text style={styles.title}>Laika</Text>
        <Text style={styles.subtitle}>
          Connecting pets, owners, vets, and shelters
        </Text>

        <View style={styles.featuresContainer}>
          <FeatureItem icon="videocam" text="Virtual vet consultations" />
          <FeatureItem icon="calendar" text="Easy appointment scheduling" />
          <FeatureItem icon="document-text" text="Complete medical records" />
          <FeatureItem icon="home" text="Connect with local shelters" />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => router.push('/auth/register')}
            style={styles.primaryButton}
          >
            Get Started
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => router.push('/auth/login')}
            style={styles.secondaryButton}
          >
            Sign In
          </Button>
        </View>

        <Text style={styles.footer}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </ScrollView>
    </View>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon as any} size={24} color={colors.primary} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureText: {
    ...typography.body,
    color: colors.text,
    marginLeft: spacing.md,
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.md,
  },
  primaryButton: {
    borderRadius: 8,
  },
  secondaryButton: {
    borderRadius: 8,
  },
  footer: {
    ...typography.small,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
