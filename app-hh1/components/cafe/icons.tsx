import Svg, { Path } from 'react-native-svg';

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
