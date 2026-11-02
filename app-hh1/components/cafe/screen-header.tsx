import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/cafe/back-button';
import { Cafe, Tipografia } from '@/constants/theme';

/**
 * Vuelve a la pantalla anterior o, si no hay historial, al landing.
 */
export function volver() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/home');
  }
}

/**
 * Encabezado con botón de retroceso arriba a la izquierda y título centrado.
 */
export function ScreenHeader({ titulo, onBack = volver }: { titulo: string; onBack?: () => void }) {
  return (
    <View style={styles.encabezado}>
      <View style={styles.atras}>
        <BackButton onPress={onBack} />
      </View>
      <Text style={styles.titulo} accessibilityRole="header">
        {titulo}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    paddingHorizontal: 20,
    paddingTop: 8,
    minHeight: 56,
    justifyContent: 'center',
  },
  atras: {
    position: 'absolute',
    left: 20,
    top: 8,
    zIndex: 1,
  },
  titulo: {
    fontFamily: Tipografia.titulo,
    fontSize: 26,
    color: Cafe.espresso,
    textAlign: 'center',
  },
});
