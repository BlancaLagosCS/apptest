import Svg, { Ellipse, Path } from 'react-native-svg';

import { Cafe } from '@/constants/theme';

type Props = {
  size?: number;
  color?: string;
  borde?: string;
  grosor?: number;
};

/**
 * Un grano de café dibujado: el fondo de las pantallas y la moneda de puntos de Cota.
 * size es el ancho; el alto es 1.3 veces el ancho.
 */
export function CoffeeBean({ size = 20, color = Cafe.latte, borde = Cafe.caramelo, grosor = 1.8 }: Props) {
  return (
    <Svg width={size} height={size * 1.3} viewBox="0 0 20 26">
      <Ellipse cx={10} cy={13} rx={8.5} ry={11.5} fill={color} stroke={borde} strokeWidth={grosor} />
      <Path d="M10 3 C6 9 14 17 10 23" fill="none" stroke={borde} strokeWidth={grosor} strokeLinecap="round" />
    </Svg>
  );
}
