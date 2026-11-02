import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Cafe, Trazo } from '@/constants/theme';

const DESPLAZAMIENTO = 5;

type Props = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

/**
 * Tarjeta con contorno grueso y sombra plana desplazada (estilo sticker 2D).
 * Si recibe onPress, al presionarla "se hunde" sobre su sombra.
 */
export function Sticker({ children, onPress, disabled, color = Cafe.espuma, style, contentStyle, accessibilityLabel }: Props) {
  const contenido = (pressed: boolean) => (
    <>
      <View style={[styles.forma, styles.sombra]} />
      <View style={[styles.forma, { backgroundColor: color }, pressed && styles.presionado, contentStyle]}>
        {children}
      </View>
    </>
  );

  if (!onPress) {
    return <View style={[styles.contenedor, style]}>{contenido(false)}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[styles.contenedor, style]}>
      {({ pressed }) => contenido(pressed)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    paddingRight: DESPLAZAMIENTO,
    paddingBottom: DESPLAZAMIENTO,
  },
  forma: {
    borderRadius: 22,
    borderWidth: Trazo,
    borderColor: Cafe.espresso,
  },
  sombra: {
    position: 'absolute',
    top: DESPLAZAMIENTO,
    left: DESPLAZAMIENTO,
    right: 0,
    bottom: 0,
    backgroundColor: Cafe.espresso,
  },
  presionado: {
    transform: [{ translateX: DESPLAZAMIENTO - 1 }, { translateY: DESPLAZAMIENTO - 1 }],
  },
});
