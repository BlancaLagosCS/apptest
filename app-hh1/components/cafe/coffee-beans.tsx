import { DimensionValue, StyleSheet, View } from 'react-native';

import { CoffeeBean } from '@/components/cafe/coffee-bean';

type Grano = {
  posicion: { top?: DimensionValue; bottom?: DimensionValue; left?: DimensionValue; right?: DimensionValue };
  rotacion: number;
  tamano: number;
};

const GRANOS: Grano[] = [
  { posicion: { top: '5%', left: '7%' }, rotacion: -25, tamano: 26 },
  { posicion: { top: '11%', right: '9%' }, rotacion: 35, tamano: 20 },
  { posicion: { top: '50%', left: '-2%' }, rotacion: 70, tamano: 22 },
  { posicion: { bottom: '13%', right: '3%' }, rotacion: -50, tamano: 28 },
  { posicion: { bottom: '4%', left: '15%' }, rotacion: 15, tamano: 18 },
];

/**
 * Granos de café dispersos y tenues que dan la temática de cafetería al fondo.
 */
export function CoffeeBeans() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {GRANOS.map(({ posicion, rotacion, tamano }, i) => (
        <View key={i} style={[styles.grano, posicion, { transform: [{ rotate: `${rotacion}deg` }] }]}>
          <CoffeeBean size={tamano} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grano: {
    position: 'absolute',
    opacity: 0.55,
  },
});
