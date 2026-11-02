import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Sticker } from '@/components/cafe/sticker';
import { Cafe, Trazo } from '@/constants/theme';

type Props = {
  children: ReactNode;
  accessibilityLabel: string;
  onPress?: () => void;
  color?: string;
  size?: number;
};

/**
 * Botón circular tipo sticker para íconos. Sin onPress se muestra como
 * insignia no presionable (sin sombra).
 */
export function IconButton({ children, accessibilityLabel, onPress, color = Cafe.espuma, size = 40 }: Props) {
  const forma = { width: size, height: size, borderRadius: size / 2 };

  if (!onPress) {
    return (
      <View style={[styles.insignia, forma, { backgroundColor: color }]} accessibilityLabel={accessibilityLabel}>
        {children}
      </View>
    );
  }

  return (
    <Sticker onPress={onPress} color={color} accessibilityLabel={accessibilityLabel} contentStyle={[styles.centro, forma]}>
      {children}
    </Sticker>
  );
}

const styles = StyleSheet.create({
  centro: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  insignia: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Trazo - 1,
    borderColor: Cafe.espresso,
  },
});
