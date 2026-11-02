import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { Animo } from '@/constants/moods';
import { Cafe, Trazo } from '@/constants/theme';

type Props = {
  animo: Animo;
  color: string;
  size?: number;
};

const linea = {
  stroke: Cafe.espresso,
  strokeWidth: Trazo,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/**
 * Tacita de café dibujada en 2D cuya expresión cambia según el estado de ánimo.
 * Ilustración provisional: se reemplazará por material propio.
 */
export function MoodCup({ animo, color, size = 96 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Vapor animo={animo} />

      {/* Plato */}
      <Ellipse cx={60} cy={102} rx={46} ry={9} fill={Cafe.latte} {...linea} />

      {/* Asa */}
      <Path d="M89 56 C106 54 106 82 85 79" fill="none" {...linea} strokeWidth={Trazo + 2} />

      {/* Taza, café y brillo */}
      <Path d="M27 46 L93 46 L87 88 Q85 98 75 98 L45 98 Q35 98 33 88 Z" fill={color} {...linea} />
      <Ellipse cx={60} cy={46} rx={33} ry={6.5} fill={Cafe.cafe} {...linea} />
      <Path d="M38 53 Q37 70 41 86" fill="none" stroke={Cafe.espuma} strokeWidth={4} strokeLinecap="round" opacity={0.7} />

      <Cara animo={animo} />
    </Svg>
  );
}

function Cara({ animo }: { animo: Animo }) {
  if (animo === 'mal') {
    return (
      <G>
        <Path d="M44 60 L53 63" fill="none" {...linea} />
        <Path d="M76 60 L67 63" fill="none" {...linea} />
        <Circle cx={50} cy={69} r={3} fill={Cafe.espresso} />
        <Circle cx={70} cy={69} r={3} fill={Cafe.espresso} />
        <Path d="M51 86 Q60 79 69 86" fill="none" {...linea} />
        {/* Lagrimita */}
        <Path d="M44 74 Q40 80 44 82 Q48 80 44 74 Z" fill="#8FB3D9" stroke={Cafe.espresso} strokeWidth={1.5} />
      </G>
    );
  }

  if (animo === 'bien') {
    return (
      <G>
        <Circle cx={50} cy={67} r={3.5} fill={Cafe.espresso} />
        <Circle cx={70} cy={67} r={3.5} fill={Cafe.espresso} />
        <Ellipse cx={43} cy={76} rx={4.5} ry={3} fill={Cafe.rubor} />
        <Ellipse cx={77} cy={76} rx={4.5} ry={3} fill={Cafe.rubor} />
        <Path d="M51 78 Q60 87 69 78" fill="none" {...linea} />
      </G>
    );
  }

  return (
    <G>
      <Path d="M44 69 Q50 61 56 69" fill="none" {...linea} />
      <Path d="M64 69 Q70 61 76 69" fill="none" {...linea} />
      <Ellipse cx={42} cy={77} rx={5} ry={3.2} fill={Cafe.rubor} />
      <Ellipse cx={78} cy={77} rx={5} ry={3.2} fill={Cafe.rubor} />
      <Path d="M49 76 Q60 94 71 76 Z" fill={Cafe.espresso} {...linea} />
      <Path d="M54 84 Q60 89 66 84" fill="none" stroke={Cafe.rubor} strokeWidth={3} strokeLinecap="round" />
    </G>
  );
}

function Vapor({ animo }: { animo: Animo }) {
  const vapor = { fill: 'none', ...linea, stroke: Cafe.cafe, opacity: 0.45 };

  if (animo === 'mal') {
    return <Path d="M60 36 C56 31 63 27 59 22" {...vapor} opacity={0.25} />;
  }

  return (
    <G>
      <Path d="M48 36 C42 28 54 22 48 12" {...vapor} />
      <Path d="M64 36 C58 28 70 22 64 12" {...vapor} />
      {animo === 'excelente' && (
        <Path
          d="M84 26 C76 20 77 10 84 14 C91 10 92 20 84 26 Z"
          fill={Cafe.rubor}
          stroke={Cafe.espresso}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      )}
    </G>
  );
}
