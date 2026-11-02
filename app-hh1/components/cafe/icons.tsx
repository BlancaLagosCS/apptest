import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Cafe, Trazo } from '@/constants/theme';

type Props = { size?: number; color?: string };

const trazo = { fill: 'none', strokeWidth: Trazo + 0.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function CheckIcon({ size = 20, color = Cafe.espresso }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M5 12.5 L10 17.5 L19 7" stroke={color} {...trazo} />
    </Svg>
  );
}

export function CrossIcon({ size = 20, color = Cafe.espresso }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6.5 6.5 L17.5 17.5 M17.5 6.5 L6.5 17.5" stroke={color} {...trazo} />
    </Svg>
  );
}

export function BackArrowIcon({ size = 22, color = Cafe.espresso }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M15 5 L8 12 L15 19" stroke={color} {...trazo} />
    </Svg>
  );
}

export function PlusIcon({ size = 20, color = Cafe.espresso }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 5 L12 19 M5 12 L19 12" stroke={color} {...trazo} />
    </Svg>
  );
}

// Siluetas rellenas para los botones del landing. "detalle" es el color de las
// líneas interiores (normalmente el fondo del botón).

type SiluetaProps = { size?: number; color?: string; detalle?: string };

const relleno = { strokeWidth: 1.5, strokeLinejoin: 'round' } as const;

export function PencilIcon({ size = 28, color = Cafe.espuma, detalle = Cafe.caramelo }: SiluetaProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M15.5 3.5 L20.5 8.5 L9 20 L3.5 20.5 L4 15 Z" fill={color} stroke={color} {...relleno} />
      <Path d="M13 6 L18 11 M4.5 15.5 L8.5 19.5" stroke={detalle} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function PersonIcon({ size = 28, color = Cafe.espuma }: SiluetaProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={7.5} r={4.5} fill={color} />
      <Path d="M3.5 21 C3.5 15.5 7.5 13.5 12 13.5 C16.5 13.5 20.5 15.5 20.5 21 Z" fill={color} stroke={color} {...relleno} />
    </Svg>
  );
}

export function NotebookIcon({ size = 28, color = Cafe.espuma, detalle = Cafe.caramelo }: SiluetaProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={5} y={2.5} width={15} height={19} rx={2.5} fill={color} />
      {/* Espiral y renglones */}
      <Path d="M3 7 L7 7 M3 12 L7 12 M3 17 L7 17" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M10 8 L17 8 M10 12 L17 12 M10 16 L15 16" stroke={detalle} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

/** Engranaje de 8 dientes con agujero central (evenodd). */
const ENGRANAJE = (() => {
  const centro = 12;
  const paso = (2 * Math.PI) / 8;
  const punto = (radio: number, angulo: number) =>
    `${(centro + radio * Math.cos(angulo)).toFixed(2)} ${(centro + radio * Math.sin(angulo)).toFixed(2)}`;

  const contorno = Array.from({ length: 8 }, (_, i) => {
    const a = i * paso;
    return [punto(7.6, a - paso * 0.32), punto(10.5, a - paso * 0.18), punto(10.5, a + paso * 0.18), punto(7.6, a + paso * 0.32)];
  }).flat();

  return `M${contorno.join(' L')} Z M15.3 12 A3.3 3.3 0 1 0 8.7 12 A3.3 3.3 0 1 0 15.3 12 Z`;
})();

export function GearIcon({ size = 28, color = Cafe.espuma }: SiluetaProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={ENGRANAJE} fill={color} fillRule="evenodd" stroke={color} strokeWidth={1} strokeLinejoin="round" />
    </Svg>
  );
}
