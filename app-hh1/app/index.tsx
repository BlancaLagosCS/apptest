import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CoffeeBeans } from '@/components/cafe/coffee-beans';
import { MoodCup } from '@/components/cafe/mood-cup';
import { Sticker } from '@/components/cafe/sticker';
import { OPCIONES_ANIMO, OpcionAnimo, opcionPorId } from '@/constants/moods';
import { Cafe, Tipografia } from '@/constants/theme';
import { getEmociones } from '@/lib/api';
import { guardarEmocion, sincronizarEmociones } from '@/lib/mood';

/**
 * Pantalla previa al landing: pregunta el estado de ánimo cada vez que se abre la app.
 */
export default function PreLandingScreen() {
  const [opciones, setOpciones] = useState<OpcionAnimo[]>(OPCIONES_ANIMO);
  const [elegida, setElegida] = useState<number | null>(null);

  useEffect(() => {
    // Los nombres vienen de tip_emo; si la API no responde se usan las opciones locales.
    getEmociones()
      .then((emociones) => {
        const desdeApi = emociones.flatMap((emocion) => {
          const local = opcionPorId(emocion.ID_Emo);
          return local ? [{ ...local, nombre: emocion.Nom_Emo }] : [];
        });
        if (desdeApi.length > 0) {
          setOpciones(desdeApi);
        }
      })
      .catch((error) => console.warn('No se pudieron cargar las emociones', error));
  }, []);

  async function elegir(opcion: OpcionAnimo) {
    if (elegida !== null) {
      return;
    }
    setElegida(opcion.id);

    await guardarEmocion(opcion.id);
    sincronizarEmociones().catch(() => {});

    // Pausa breve para que se vea la selección antes de pasar al landing.
    setTimeout(() => router.replace('/home'), 450);
  }

  return (
    <SafeAreaView style={styles.pantalla}>
      <CoffeeBeans />

      <Animated.View entering={FadeInUp.duration(500)} style={styles.encabezado}>
        <Text style={styles.marca}>Cota</Text>
        <Text style={styles.slogan}>tu Compañero de Tareas</Text>
        <Text style={styles.titulo}>¿Cuál es tu estado de ánimo?</Text>
        <Text style={styles.subtitulo}>Elige la taza que más se parece a tu día</Text>
      </Animated.View>

      <View style={styles.opciones}>
        {opciones.map((opcion, i) => {
          const esElegida = elegida === opcion.id;
          const atenuada = elegida !== null && !esElegida;

          return (
            <Animated.View key={opcion.id} entering={FadeInDown.delay(150 + i * 120).duration(450)}>
              <Sticker
                onPress={() => elegir(opcion)}
                disabled={elegida !== null}
                color={esElegida ? opcion.color : Cafe.espuma}
                accessibilityLabel={`Me siento ${opcion.nombre}`}
                style={atenuada && styles.atenuada}
                contentStyle={styles.tarjeta}>
                <View style={[styles.circulo, { backgroundColor: esElegida ? Cafe.espuma : opcion.color }]}>
                  <MoodCup animo={opcion.animo} color={opcion.color} size={76} />
                </View>
                <Text style={styles.nombre}>{opcion.nombre}</Text>
              </Sticker>
            </Animated.View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: Cafe.crema,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  encabezado: {
    alignItems: 'center',
    marginBottom: 32,
  },
  marca: {
    fontFamily: Tipografia.titulo,
    fontSize: 44,
    color: Cafe.caramelo,
  },
  slogan: {
    fontFamily: Tipografia.textoFuerte,
    fontSize: 15,
    color: Cafe.cafe,
    marginBottom: 28,
  },
  titulo: {
    fontFamily: Tipografia.titulo,
    fontSize: 30,
    lineHeight: 36,
    color: Cafe.espresso,
    textAlign: 'center',
  },
  subtitulo: {
    fontFamily: Tipografia.texto,
    fontSize: 16,
    color: Cafe.cafe,
    marginTop: 8,
    textAlign: 'center',
  },
  opciones: {
    gap: 16,
  },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 18,
  },
  circulo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nombre: {
    fontFamily: Tipografia.titulo,
    fontSize: 26,
    color: Cafe.espresso,
  },
  atenuada: {
    opacity: 0.45,
  },
});
