import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';

import { MoodCup } from '@/components/cafe/mood-cup';
import { Sticker } from '@/components/cafe/sticker';
import { Cafe, Tipografia } from '@/constants/theme';

/**
 * Mensaje emergente de celebración con la tacita feliz.
 */
export function CelebrationToast({ visible, mensaje }: { visible: boolean; mensaje: string }) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.capa} pointerEvents="none">
      <Animated.View entering={ZoomIn.springify().damping(12)} exiting={FadeOut.duration(250)}>
        <Sticker color={Cafe.animo.excelente} contentStyle={styles.tarjeta}>
          <MoodCup animo="excelente" color={Cafe.espuma} size={96} />
          <Text style={styles.texto} accessibilityLiveRegion="polite">
            {mensaje}
          </Text>
        </Sticker>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  capa: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 248, 238, 0.6)',
  },
  tarjeta: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
  texto: {
    fontFamily: Tipografia.titulo,
    fontSize: 24,
    color: Cafe.espresso,
    marginTop: 8,
  },
});
