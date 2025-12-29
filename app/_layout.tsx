// app/_layout.tsx
import { Stack } from 'expo-router';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../src/store';
import { colors } from '../src/constants/theme';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
  },
};

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/login" />
        </Stack>
      </PaperProvider>
    </ReduxProvider>
  );
}
