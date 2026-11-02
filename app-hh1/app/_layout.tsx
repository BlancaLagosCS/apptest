import { Fredoka_500Medium, Fredoka_600SemiBold } from '@expo-google-fonts/fredoka';
import { Nunito_600SemiBold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { Cafe } from '@/constants/theme';
import { sincronizarEmociones } from '@/lib/mood';

SplashScreen.preventAutoHideAsync();

const temaCafe = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Cafe.caramelo,
    background: Cafe.crema,
    card: Cafe.espuma,
    text: Cafe.espresso,
    border: Cafe.latte,
  },
};

export default function RootLayout() {
  const [fuentesListas, errorFuentes] = useFonts({
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Nunito_600SemiBold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fuentesListas || errorFuentes) {
      SplashScreen.hideAsync();
    }
  }, [fuentesListas, errorFuentes]);

  useEffect(() => {
    // Reintenta enviar emociones guardadas en aperturas anteriores.
    sincronizarEmociones().catch(() => {});
  }, []);

  if (!fuentesListas && !errorFuentes) {
    return null;
  }

  return (
    <ThemeProvider value={temaCafe}>
      <Stack screenOptions={{ contentStyle: { backgroundColor: Cafe.crema } }}>
        {/* Pantalla previa al landing: es la ruta inicial, aparece en cada apertura */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="tareas/nueva" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
