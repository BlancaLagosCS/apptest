import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { CoffeeBean } from '@/components/cafe/coffee-bean';
import { Cafe, Tipografia, Trazo } from '@/constants/theme';

/**
 * Insignia flotante "+N granos" que aparece al realizar una tarea.
 * Cambiar "vez" la vuelve a animar aunque la cantidad sea la misma.
 */
export function GranosGanados({ cantidad, vez }: { cantidad: number | null; vez: number }) {
  if (!cantidad) {
    return null;
  }

  return (
    <View style={styles.capa} pointerEvents="none">
      <Animated.View
        key={vez}
        entering={FadeInDown.springify().damping(14)}
        exiting={FadeOutUp.duration(300)}
        style={styles.insignia}>
        <Text style={styles.texto} accessibilityLiveRegion="polite">
          +{cantidad} {cantidad === 1 ? 'grano' : 'granos'}
        </Text>
        <CoffeeBean size={16} color={Cafe.caramelo} borde={Cafe.espresso} grosor={2} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  capa: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  insignia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Cafe.menta,
    borderWidth: Trazo,
    borderColor: Cafe.espresso,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  texto: {
    fontFamily: Tipografia.titulo,
    fontSize: 20,
    color: Cafe.espresso,
  },
});
