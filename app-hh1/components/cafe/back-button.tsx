import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Sticker } from '@/components/cafe/sticker';
import { Cafe, Trazo } from '@/constants/theme';

/**
 * Botón circular de retroceso con flecha dibujada.
 */
export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Sticker onPress={onPress} accessibilityLabel="Volver" contentStyle={styles.circulo}>
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Path
          d="M15 5 L8 12 L15 19"
          fill="none"
          stroke={Cafe.espresso}
          strokeWidth={Trazo + 0.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Sticker>
  );
}

const styles = StyleSheet.create({
  circulo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
