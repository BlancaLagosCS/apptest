import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CoffeeBeans } from '@/components/cafe/coffee-beans';
import { MoodCup } from '@/components/cafe/mood-cup';
import { Sticker } from '@/components/cafe/sticker';
import { OpcionAnimo, opcionPorId } from '@/constants/moods';
import { Cafe, Tipografia } from '@/constants/theme';
import { getUltimaEmocion } from '@/lib/mood';

/**
 * Landing provisional: muestra el ánimo elegido en la pantalla previa.
 */
export default function HomeScreen() {
  const [opcion, setOpcion] = useState<OpcionAnimo>();

  useEffect(() => {
    getUltimaEmocion().then((id) => setOpcion(opcionPorId(id)));
  }, []);

  return (
    <SafeAreaView style={styles.pantalla} edges={['top']}>
      <CoffeeBeans />

      <Text style={styles.titulo}>¡Bienvenido a Cota!</Text>

      {opcion && (
        <Sticker contentStyle={styles.tarjeta}>
          <MoodCup animo={opcion.animo} color={opcion.color} size={140} />
          <Text style={styles.etiqueta}>
            Hoy te sientes: <Text style={styles.animo}>{opcion.nombre}</Text>
          </Text>
          <Text style={styles.mensaje}>{opcion.mensaje}</Text>
        </Sticker>
      )}

      <Sticker
        onPress={() => router.push('/tareas/nueva')}
        color={Cafe.caramelo}
        style={styles.boton}
        contentStyle={styles.botonContenido}>
        <Text style={styles.botonTexto}>Nueva tarea</Text>
      </Sticker>

      <Sticker onPress={() => router.replace('/')} style={styles.boton} contentStyle={styles.botonContenido}>
        <Text style={[styles.botonTexto, styles.botonSecundario]}>Cambiar mi ánimo</Text>
      </Sticker>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: Cafe.crema,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 24,
  },
  titulo: {
    fontFamily: Tipografia.titulo,
    fontSize: 30,
    color: Cafe.espresso,
    textAlign: 'center',
  },
  tarjeta: {
    alignItems: 'center',
    padding: 24,
  },
  etiqueta: {
    fontFamily: Tipografia.texto,
    fontSize: 18,
    color: Cafe.cafe,
    marginTop: 12,
  },
  animo: {
    fontFamily: Tipografia.titulo,
    color: Cafe.espresso,
  },
  mensaje: {
    fontFamily: Tipografia.texto,
    fontSize: 16,
    lineHeight: 22,
    color: Cafe.espresso,
    textAlign: 'center',
    marginTop: 8,
  },
  boton: {
    alignSelf: 'center',
  },
  botonContenido: {
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  botonTexto: {
    fontFamily: Tipografia.textoFuerte,
    fontSize: 17,
    color: Cafe.espuma,
  },
  botonSecundario: {
    color: Cafe.espresso,
  },
});
