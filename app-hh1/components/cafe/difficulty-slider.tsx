import { useEffect, useRef, useState } from 'react';
import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Ellipse, Path } from 'react-native-svg';

import { Cafe, Tipografia, Trazo } from '@/constants/theme';
import { Dificultad } from '@/lib/api';

const OPCIONES: { valor: Dificultad; nombre: string; color: string }[] = [
  { valor: 1, nombre: 'Fácil', color: Cafe.menta },
  { valor: 2, nombre: 'Intermedio', color: Cafe.animo.bien },
  { valor: 3, nombre: 'Difícil', color: Cafe.rubor },
];

const SELECTOR = 40;
const MARGEN = SELECTOR / 2;

type Props = {
  valor: Dificultad;
  onChange: (valor: Dificultad) => void;
};

/**
 * Slider de 3 posiciones (Fácil, Intermedio, Difícil). El selector es un grano
 * de café que se arrastra o toca y encaja en la posición más cercana.
 */
export function DifficultySlider({ valor, onChange }: Props) {
  const [ancho, setAncho] = useState(0);
  const posicion = useSharedValue(0);
  // Posición del selector y del dedo al empezar a arrastrar.
  const arrastre = useRef({ x: 0, pageX: 0 });

  const xDe = (v: Dificultad) => ((v - 1) * ancho) / 2;
  const limitar = (x: number) => Math.min(Math.max(x, 0), ancho);
  const xActual = (evento: GestureResponderEvent) =>
    limitar(arrastre.current.x + evento.nativeEvent.pageX - arrastre.current.pageX);

  useEffect(() => {
    posicion.set(withSpring(((valor - 1) * ancho) / 2, { damping: 15 }));
  }, [valor, ancho, posicion]);

  const estiloSelector = useAnimatedStyle(() => ({
    transform: [{ translateX: posicion.get() }],
  }));

  function empezar(evento: GestureResponderEvent) {
    arrastre.current = { x: limitar(evento.nativeEvent.locationX - MARGEN), pageX: evento.nativeEvent.pageX };
    posicion.set(arrastre.current.x);
  }

  function soltar(evento: GestureResponderEvent) {
    if (ancho === 0) return;
    const nuevo = (Math.round(xActual(evento) / (ancho / 2)) + 1) as Dificultad;
    posicion.set(withSpring(xDe(nuevo), { damping: 15 }));
    onChange(nuevo);
  }

  const actual = OPCIONES[valor - 1];

  return (
    <View>
      <View
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        // Evita que el ScrollView del formulario se quede con el gesto.
        onResponderTerminationRequest={() => false}
        onResponderGrant={empezar}
        onResponderMove={(evento) => posicion.set(xActual(evento))}
        onResponderRelease={soltar}
        onLayout={(evento) => setAncho(evento.nativeEvent.layout.width - SELECTOR)}
        style={styles.zonaTactil}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Dificultad"
        accessibilityValue={{ text: actual.nombre }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={({ nativeEvent }) => {
          const delta = nativeEvent.actionName === 'increment' ? 1 : -1;
          onChange(Math.min(3, Math.max(1, valor + delta)) as Dificultad);
        }}>
        <View style={styles.pista} pointerEvents="none">
          {OPCIONES.map((opcion) => (
            <View key={opcion.valor} style={[styles.parada, { backgroundColor: opcion.color }]} />
          ))}
        </View>

        <Animated.View style={[styles.selector, estiloSelector]} pointerEvents="none">
          <Svg width={SELECTOR} height={SELECTOR} viewBox="0 0 40 40">
            <Ellipse cx={20} cy={20} rx={13} ry={17} fill={actual.color} stroke={Cafe.espresso} strokeWidth={Trazo} />
            <Path d="M20 5 C13 14 27 26 20 35" fill="none" stroke={Cafe.espresso} strokeWidth={Trazo - 0.5} strokeLinecap="round" />
          </Svg>
        </Animated.View>
      </View>

      <View style={styles.etiquetas}>
        {OPCIONES.map((opcion) => (
          <Text
            key={opcion.valor}
            onPress={() => onChange(opcion.valor)}
            style={[styles.etiqueta, opcion.valor === valor && styles.etiquetaActiva]}>
            {opcion.nombre}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  zonaTactil: {
    height: SELECTOR + 8,
    justifyContent: 'center',
  },
  pista: {
    marginHorizontal: MARGEN,
    height: 14,
    borderRadius: 7,
    borderWidth: Trazo,
    borderColor: Cafe.espresso,
    backgroundColor: Cafe.latte,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  parada: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: -5,
    borderWidth: 2,
    borderColor: Cafe.espresso,
  },
  selector: {
    position: 'absolute',
    left: 0,
  },
  etiquetas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  etiqueta: {
    width: 96,
    fontFamily: Tipografia.texto,
    fontSize: 14,
    color: Cafe.cafe,
    textAlign: 'center',
    marginHorizontal: -28,
  },
  etiquetaActiva: {
    fontFamily: Tipografia.textoFuerte,
    color: Cafe.espresso,
  },
});
