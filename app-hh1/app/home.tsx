import { router, useFocusEffect } from 'expo-router';
import { ComponentType, useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Aviso, useAviso } from '@/components/cafe/aviso';
import { CoffeeBean } from '@/components/cafe/coffee-bean';
import { CoffeeBeans } from '@/components/cafe/coffee-beans';
import { IconButton } from '@/components/cafe/icon-button';
import { GearIcon, NotebookIcon, PencilIcon, PersonIcon, PlusIcon } from '@/components/cafe/icons';
import { MoodCup } from '@/components/cafe/mood-cup';
import { Sticker } from '@/components/cafe/sticker';
import { OpcionAnimo, opcionPorId } from '@/constants/moods';
import { Cafe, Tipografia, Trazo } from '@/constants/theme';
import { getPuntos, listarPendientes, Tarea } from '@/lib/api';
import { etiquetaDeadline } from '@/lib/dates';
import { getUltimaEmocion } from '@/lib/mood';

const TAREAS_EN_TABLA = 3;

const FRASES = [
  '¿List@ para el día de hoy?',
  '¿Qué tarea conquistamos primero?',
  'Un sorbo a la vez, una tarea a la vez ☕',
  '¿Preparad@ para sumar granos?',
  'Hoy es un buen día para avanzar',
];

type Silueta = ComponentType<{ size?: number; color?: string; detalle?: string }>;

const BOTONES: { etiqueta: string; Icono: Silueta; color: string }[] = [
  { etiqueta: 'Editar', Icono: PencilIcon, color: Cafe.caramelo },
  { etiqueta: 'Perfil', Icono: PersonIcon, color: Cafe.cafe },
  { etiqueta: 'Libreta', Icono: NotebookIcon, color: Cafe.caramelo },
  { etiqueta: 'Ajustes', Icono: GearIcon, color: Cafe.cafe },
];

type Carga = 'cargando' | 'lista' | 'error';

/**
 * Landing: granos disponibles, próximas tareas, la taza del ánimo de hoy y los
 * accesos a las demás funcionalidades.
 */
export default function LandingScreen() {
  const { height } = useWindowDimensions();
  const [granos, setGranos] = useState<number | null>(null);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [carga, setCarga] = useState<Carga>('cargando');
  const [opcion, setOpcion] = useState<OpcionAnimo>();
  const [frase, setFrase] = useState(FRASES[0]);
  const { aviso, mostrar } = useAviso(3000);

  // Se recarga al volver al landing (p. ej. después de realizar tareas).
  const cargar = useCallback(() => {
    let activa = true;
    setFrase(otraFrase);

    getUltimaEmocion().then((id) => {
      if (activa) setOpcion(opcionPorId(id));
    });

    getPuntos()
      .then((puntos) => {
        if (activa) setGranos(puntos.Cont_Tot);
      })
      .catch((error) => console.warn('No se pudieron cargar los granos', error));

    listarPendientes(TAREAS_EN_TABLA)
      .then((lista) => {
        if (!activa) return;
        setTareas(lista);
        setCarga('lista');
      })
      .catch((error) => {
        console.warn('No se pudieron cargar las tareas', error);
        if (activa) setCarga('error');
      });

    return () => {
      activa = false;
    };
  }, []);

  useFocusEffect(cargar);

  return (
    <SafeAreaView style={styles.pantalla}>
      <CoffeeBeans />

      <View style={styles.encabezado}>
        <Text style={styles.marca}>Cota</Text>
        <ContadorGranos valor={granos} />
      </View>

      <Sticker
        onPress={() => router.push('/tareas')}
        accessibilityLabel="Ver tus tareas"
        style={{ maxHeight: height * 0.25 }}
        contentStyle={styles.tabla}>
        <View style={styles.tablaEncabezado}>
          <Text style={styles.tablaTitulo}>Próximas tareas</Text>
          <IconButton
            onPress={() => router.push('/tareas/nueva')}
            color={Cafe.caramelo}
            size={30}
            accessibilityLabel="Ingresar una tarea nueva">
            <PlusIcon size={16} color={Cafe.espuma} />
          </IconButton>
        </View>
        <TablaTareas tareas={tareas} carga={carga} />
      </Sticker>

      <View style={styles.escena}>
        <View style={styles.burbuja}>
          <Animated.Text key={frase} entering={FadeIn.duration(300)} style={styles.burbujaTexto}>
            {frase}
          </Animated.Text>
          <View style={styles.burbujaCola} />
        </View>
        <Pressable onPress={() => setFrase(otraFrase)} accessibilityLabel="Otra frase motivadora">
          <MoodCup
            animo={opcion?.animo ?? 'bien'}
            color={opcion?.color ?? Cafe.animo.bien}
            size={Math.min(170, height * 0.22)}
          />
        </Pressable>
      </View>

      <View style={styles.botones}>
        {BOTONES.map(({ etiqueta, Icono, color }) => (
          <IconButton
            key={etiqueta}
            onPress={() => mostrar('Feature pendiente')}
            color={color}
            size={62}
            accessibilityLabel={etiqueta}>
            <Icono size={30} color={Cafe.espuma} detalle={color} />
          </IconButton>
        ))}
      </View>

      <Aviso texto={aviso} inferior={110} />
    </SafeAreaView>
  );
}

function otraFrase(actual: string): string {
  const opciones = FRASES.filter((frase) => frase !== actual);
  return opciones[Math.floor(Math.random() * opciones.length)];
}

/** Granos disponibles; da un saltito cuando el número cambia. */
function ContadorGranos({ valor }: { valor: number | null }) {
  const escala = useSharedValue(1);
  const anterior = useRef<number | null>(null);
  const estilo = useAnimatedStyle(() => ({ transform: [{ scale: escala.get() }] }));

  useEffect(() => {
    if (anterior.current !== null && valor !== null && valor !== anterior.current) {
      escala.set(withSequence(withSpring(1.3, { damping: 6 }), withSpring(1)));
    }
    anterior.current = valor;
  }, [valor, escala]);

  return (
    <View style={styles.contador} accessibilityLabel={`${valor ?? 0} granos de café`}>
      <CoffeeBean size={20} color={Cafe.caramelo} borde={Cafe.espresso} grosor={2} />
      <Animated.Text style={[styles.contadorTexto, estilo]}>{valor ?? '–'}</Animated.Text>
    </View>
  );
}

function TablaTareas({ tareas, carga }: { tareas: Tarea[]; carga: Carga }) {
  if (carga !== 'lista' || tareas.length === 0) {
    const mensaje =
      carga === 'cargando'
        ? 'Preparando tus tareas…'
        : carga === 'error'
          ? 'No pudimos cargar tus tareas.'
          : 'Sin tareas pendientes';
    return <Text style={styles.tablaVacia}>{mensaje}</Text>;
  }

  const ahora = new Date();

  return (
    <View>
      {tareas.map((tarea, i) => {
        const deadline = etiquetaDeadline(tarea.Deadline, ahora, 'corto');
        return (
          <View key={tarea.ID_Tar} style={[styles.fila, i > 0 && styles.filaSeparada]}>
            <Text style={styles.colNombre} numberOfLines={1}>
              {tarea.Nom_Tar}
            </Text>
            <Text style={[styles.colFecha, deadline?.vencida && styles.vencida]}>{deadline?.texto ?? '—'}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: Cafe.crema,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  marca: {
    fontFamily: Tipografia.titulo,
    fontSize: 30,
    color: Cafe.espresso,
  },
  contador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Cafe.espuma,
    borderWidth: Trazo,
    borderColor: Cafe.espresso,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  contadorTexto: {
    fontFamily: Tipografia.titulo,
    fontSize: 22,
    color: Cafe.espresso,
    minWidth: 24,
    textAlign: 'center',
  },
  tabla: {
    flexShrink: 1,
    overflow: 'hidden',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  tablaEncabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tablaTitulo: {
    fontFamily: Tipografia.tituloSuave,
    fontSize: 17,
    color: Cafe.espresso,
  },
  tablaVacia: {
    fontFamily: Tipografia.texto,
    fontSize: 15,
    color: Cafe.cafe,
    textAlign: 'center',
    paddingVertical: 12,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  filaSeparada: {
    borderTopWidth: 1.5,
    borderTopColor: Cafe.latte,
  },
  // Columnas en relación 80:20
  colNombre: {
    flex: 4,
    fontFamily: Tipografia.textoFuerte,
    fontSize: 15,
    color: Cafe.espresso,
    paddingRight: 8,
  },
  colFecha: {
    flex: 1,
    fontFamily: Tipografia.textoFuerte,
    fontSize: 15,
    color: Cafe.cafe,
    textAlign: 'right',
  },
  vencida: {
    color: Cafe.burdeo,
  },
  escena: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  burbuja: {
    maxWidth: '85%',
    backgroundColor: Cafe.espuma,
    borderWidth: Trazo,
    borderColor: Cafe.espresso,
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  burbujaTexto: {
    fontFamily: Tipografia.titulo,
    fontSize: 20,
    lineHeight: 26,
    color: Cafe.espresso,
    textAlign: 'center',
  },
  // Cuadrado girado que asoma bajo la burbuja como "colita" apuntando a la taza.
  burbujaCola: {
    position: 'absolute',
    bottom: -9,
    alignSelf: 'center',
    width: 16,
    height: 16,
    backgroundColor: Cafe.espuma,
    borderRightWidth: Trazo,
    borderBottomWidth: Trazo,
    borderColor: Cafe.espresso,
    transform: [{ rotate: '45deg' }],
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
