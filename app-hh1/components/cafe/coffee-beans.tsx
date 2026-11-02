import { DimensionValue, StyleSheet, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

import { Cafe } from '@/constants/theme';

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
          <Svg width={tamano} height={tamano * 1.3} viewBox="0 0 20 26">
            <Ellipse cx={10} cy={13} rx={8.5} ry={11.5} fill={Cafe.latte} stroke={Cafe.caramelo} strokeWidth={1.8} />
            <Path d="M10 3 C6 9 14 17 10 23" fill="none" stroke={Cafe.caramelo} strokeWidth={1.8} strokeLinecap="round" />
          </Svg>
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
