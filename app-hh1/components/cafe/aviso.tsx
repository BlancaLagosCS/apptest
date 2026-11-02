import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Cafe, Tipografia } from '@/constants/theme';

/**
 * Mensaje temporal. Volver a mostrar uno (aunque sea el mismo texto) reinicia el tiempo.
 */
export function useAviso(duracionMs: number) {
  const [aviso, setAviso] = useState<{ texto: string; vez: number } | null>(null);

  useEffect(() => {
    if (!aviso) return;
    const timer = setTimeout(() => setAviso(null), duracionMs);
    return () => clearTimeout(timer);
  }, [aviso, duracionMs]);

  function mostrar(texto: string) {
    setAviso((anterior) => ({ texto, vez: (anterior?.vez ?? 0) + 1 }));
  }

  return { aviso: aviso?.texto ?? null, mostrar };
}

type Props = {
  texto: string | null;
  tono?: 'info' | 'error';
  /** Distancia desde el borde inferior, para no tapar botones de la pantalla. */
  inferior?: number;
};

/**
 * Cartel flotante en la parte inferior. "error" usa burdeo; "info", los tonos café.
 */
export function Aviso({ texto, tono = 'info', inferior = 32 }: Props) {
  if (!texto) {
    return null;
  }

  const color = tono === 'error' ? Cafe.burdeo : Cafe.espresso;

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[styles.aviso, { borderColor: color, bottom: inferior }]}
      pointerEvents="none">
      <Text style={[styles.texto, { color }]} accessibilityLiveRegion="polite">
        {texto}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  aviso: {
    position: 'absolute',
    left: 24,
    right: 24,
    backgroundColor: Cafe.espuma,
    borderWidth: 2,
    borderRadius: 16,
    padding: 12,
  },
  texto: {
    fontFamily: Tipografia.textoFuerte,
    fontSize: 15,
    textAlign: 'center',
  },
});
