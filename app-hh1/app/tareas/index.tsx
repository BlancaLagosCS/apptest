import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CoffeeBeans } from '@/components/cafe/coffee-beans';
import { ConfirmDialog } from '@/components/cafe/confirm-dialog';
import { IconButton } from '@/components/cafe/icon-button';
import { CheckIcon, CrossIcon } from '@/components/cafe/icons';
import { ScreenHeader } from '@/components/cafe/screen-header';
import { Sticker } from '@/components/cafe/sticker';
import { Cafe, Tipografia } from '@/constants/theme';
import { cambiarEstadoTarea, listarPendientes, listarRealizadasHoy, Tarea } from '@/lib/api';
import { aFechaApi, etiquetaDeadline } from '@/lib/dates';

type Carga = 'cargando' | 'lista' | 'error';

/**
 * Tus Tareas: pendientes (se marcan como realizadas o eliminadas) y las realizadas hoy.
 */
export default function TusTareasScreen() {
  const [pendientes, setPendientes] = useState<Tarea[]>([]);
  const [realizadas, setRealizadas] = useState<Tarea[]>([]);
  const [carga, setCarga] = useState<Carga>('cargando');
  const [aEliminar, setAEliminar] = useState<Tarea | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const cargar = useCallback(() => {
    let activa = true;
    Promise.all([listarPendientes(), listarRealizadasHoy()])
      .then(([p, r]) => {
        if (!activa) return;
        setPendientes(p);
        setRealizadas(r);
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

  // Recarga cada vez que la pantalla vuelve a estar visible (p. ej. tras crear una tarea).
  useFocusEffect(cargar);

  useEffect(() => {
    if (!aviso) return;
    const timer = setTimeout(() => setAviso(null), 3500);
    return () => clearTimeout(timer);
  }, [aviso]);

  async function marcarRealizada(tarea: Tarea) {
    // Se mueve de inmediato; si el backend falla, vuelve a su lugar.
    const optimista: Tarea = { ...tarea, Est_Tar: 'Realizada', Fecha_Real: aFechaApi(new Date()) };
    setPendientes((lista) => lista.filter((t) => t.ID_Tar !== tarea.ID_Tar));
    setRealizadas((lista) => [optimista, ...lista]);

    try {
      const actualizada = await cambiarEstadoTarea(tarea.ID_Tar, 'Realizada');
      setRealizadas((lista) => lista.map((t) => (t.ID_Tar === actualizada.ID_Tar ? actualizada : t)));
    } catch {
      setRealizadas((lista) => lista.filter((t) => t.ID_Tar !== tarea.ID_Tar));
      setPendientes((lista) => ordenarPorDeadline([...lista, tarea]));
      setAviso('No pudimos marcar la tarea como realizada. Inténtalo de nuevo.');
    }
  }

  async function confirmarEliminar() {
    const tarea = aEliminar;
    setAEliminar(null);
    if (!tarea) return;

    setPendientes((lista) => lista.filter((t) => t.ID_Tar !== tarea.ID_Tar));
    try {
      await cambiarEstadoTarea(tarea.ID_Tar, 'Eliminada');
    } catch {
      setPendientes((lista) => ordenarPorDeadline([...lista, tarea]));
      setAviso('No pudimos eliminar la tarea. Inténtalo de nuevo.');
    }
  }

  return (
    <SafeAreaView style={styles.pantalla}>
      <CoffeeBeans />
      <ScreenHeader titulo="Tus Tareas" />

      {carga === 'cargando' && <Text style={styles.estadoCarga}>Preparando tus tareas…</Text>}

      {carga === 'error' && (
        <View style={styles.centro}>
          <Text style={styles.estadoCarga}>No pudimos cargar tus tareas.</Text>
          <Sticker
            onPress={() => {
              setCarga('cargando');
              cargar();
            }}
            color={Cafe.caramelo}
            contentStyle={styles.botonContenido}>
            <Text style={styles.botonTexto}>Reintentar</Text>
          </Sticker>
        </View>
      )}

      {carga === 'lista' && (
        <View style={styles.secciones}>
          <Sticker style={styles.seccionPendientes} contentStyle={styles.tarjeta}>
            <Text style={styles.tituloSeccion}>Pendientes ({pendientes.length})</Text>
            <ScrollView contentContainerStyle={styles.lista}>
              {pendientes.length === 0 ? (
                <View style={styles.vacio}>
                  <Text style={styles.textoVacio}>¡No tienes tareas pendientes! Disfruta tu café.</Text>
                  <Sticker
                    onPress={() => router.push('/tareas/nueva')}
                    color={Cafe.caramelo}
                    contentStyle={styles.botonContenido}>
                    <Text style={styles.botonTexto}>Ingresar tarea</Text>
                  </Sticker>
                </View>
              ) : (
                pendientes.map((tarea) => (
                  <FilaPendiente
                    key={tarea.ID_Tar}
                    tarea={tarea}
                    onRealizada={() => marcarRealizada(tarea)}
                    onEliminar={() => setAEliminar(tarea)}
                  />
                ))
              )}
            </ScrollView>
          </Sticker>

          <Sticker color={Cafe.latte} style={styles.seccionRealizadas} contentStyle={styles.tarjeta}>
            <Text style={styles.tituloSeccion}>Tareas Realizadas Hoy ({realizadas.length})</Text>
            <ScrollView contentContainerStyle={styles.lista}>
              {realizadas.length === 0 ? (
                <Text style={[styles.textoVacio, styles.vacio]}>{mensajeAnimo(pendientes.length)}</Text>
              ) : (
                realizadas.map((tarea) => (
                  <Animated.View
                    key={tarea.ID_Tar}
                    entering={FadeIn.duration(300)}
                    layout={LinearTransition}
                    style={styles.fila}>
                    <Text style={[styles.nombre, styles.nombreRealizada]} numberOfLines={2}>
                      {tarea.Nom_Tar}
                    </Text>
                    <IconButton accessibilityLabel="Realizada" color={Cafe.menta} size={32}>
                      <CheckIcon size={16} />
                    </IconButton>
                  </Animated.View>
                ))
              )}
            </ScrollView>
          </Sticker>
        </View>
      )}

      {aviso && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.aviso} pointerEvents="none">
          <Text style={styles.avisoTexto}>{aviso}</Text>
        </Animated.View>
      )}

      <ConfirmDialog
        visible={aEliminar !== null}
        mensaje="¿Seguro que desea eliminar la tarea?"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </SafeAreaView>
  );
}

function FilaPendiente({ tarea, onRealizada, onEliminar }: { tarea: Tarea; onRealizada: () => void; onEliminar: () => void }) {
  const deadline = etiquetaDeadline(tarea.Deadline);

  return (
    <Animated.View exiting={FadeOut.duration(200)} layout={LinearTransition} style={styles.fila}>
      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={2}>
          {tarea.Nom_Tar}
        </Text>
        {deadline ? (
          <Text style={styles.deadline}>
            Fecha límite: <Text style={deadline.vencida ? styles.vencida : styles.aTiempo}>{deadline.texto}</Text>
          </Text>
        ) : (
          <Text style={[styles.deadline, styles.sinFecha]}>Sin fecha límite</Text>
        )}
      </View>
      <View style={styles.acciones}>
        <IconButton onPress={onRealizada} color={Cafe.menta} accessibilityLabel={`Marcar "${tarea.Nom_Tar}" como realizada`}>
          <CheckIcon />
        </IconButton>
        <IconButton onPress={onEliminar} color={Cafe.rubor} accessibilityLabel={`Eliminar "${tarea.Nom_Tar}"`}>
          <CrossIcon />
        </IconButton>
      </View>
    </Animated.View>
  );
}

function mensajeAnimo(cantidadPendientes: number): string {
  if (cantidadPendientes === 0) {
    return 'Aún no has realizado tareas hoy. ¡Agrega una y empieza tu día con energía!';
  }
  const tareas = cantidadPendientes === 1 ? '1 tarea pendiente' : `${cantidadPendientes} tareas pendientes`;
  return `Aún no has realizado tareas hoy. ¡Tú puedes! Tienes ${tareas} esperándote, empieza por una.`;
}

/** Mismo orden que el backend: deadline más cercano primero y las sin fecha al final. */
function ordenarPorDeadline(tareas: Tarea[]): Tarea[] {
  return [...tareas].sort((a, b) => {
    if (a.Deadline === b.Deadline) return a.ID_Tar - b.ID_Tar;
    if (!a.Deadline) return 1;
    if (!b.Deadline) return -1;
    return a.Deadline.localeCompare(b.Deadline);
  });
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: Cafe.crema,
  },
  centro: {
    alignItems: 'center',
    gap: 16,
  },
  estadoCarga: {
    fontFamily: Tipografia.texto,
    fontSize: 16,
    color: Cafe.cafe,
    textAlign: 'center',
    marginTop: 40,
  },
  secciones: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 16,
  },
  seccionPendientes: {
    flex: 3,
  },
  seccionRealizadas: {
    flex: 2,
  },
  tarjeta: {
    flex: 1,
    paddingTop: 14,
    paddingHorizontal: 14,
  },
  tituloSeccion: {
    fontFamily: Tipografia.tituloSuave,
    fontSize: 18,
    color: Cafe.espresso,
    marginBottom: 8,
  },
  lista: {
    gap: 10,
    paddingBottom: 14,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: Cafe.latte,
  },
  info: {
    flex: 1,
  },
  nombre: {
    flex: 1,
    fontFamily: Tipografia.textoFuerte,
    fontSize: 16,
    color: Cafe.espresso,
  },
  nombreRealizada: {
    fontFamily: Tipografia.texto,
  },
  deadline: {
    fontFamily: Tipografia.texto,
    fontSize: 13,
    color: Cafe.cafe,
    marginTop: 2,
  },
  aTiempo: {
    fontFamily: Tipografia.textoFuerte,
    color: Cafe.cafe,
  },
  vencida: {
    fontFamily: Tipografia.textoFuerte,
    color: Cafe.burdeo,
  },
  sinFecha: {
    color: Cafe.caramelo,
  },
  acciones: {
    flexDirection: 'row',
    gap: 6,
  },
  vacio: {
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
  },
  textoVacio: {
    fontFamily: Tipografia.texto,
    fontSize: 15,
    lineHeight: 21,
    color: Cafe.cafe,
    textAlign: 'center',
  },
  botonContenido: {
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  botonTexto: {
    fontFamily: Tipografia.textoFuerte,
    fontSize: 15,
    color: Cafe.espuma,
  },
  aviso: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    backgroundColor: Cafe.espuma,
    borderWidth: 2,
    borderColor: Cafe.burdeo,
    borderRadius: 16,
    padding: 12,
  },
  avisoTexto: {
    fontFamily: Tipografia.texto,
    fontSize: 14,
    color: Cafe.burdeo,
    textAlign: 'center',
  },
});
