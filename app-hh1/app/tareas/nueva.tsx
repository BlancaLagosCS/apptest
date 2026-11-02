import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CelebrationToast } from '@/components/cafe/celebration-toast';
import { CoffeeBeans } from '@/components/cafe/coffee-beans';
import { DateField, estilosCampo } from '@/components/cafe/date-field';
import { DifficultySlider } from '@/components/cafe/difficulty-slider';
import { ScreenHeader, volver } from '@/components/cafe/screen-header';
import { Sticker } from '@/components/cafe/sticker';
import { Cafe, Tipografia } from '@/constants/theme';
import { crearTarea, Dificultad } from '@/lib/api';
import { aFechaApi } from '@/lib/dates';

const MAX_NOMBRE = 150;

type Errores = Partial<Record<'Nom_Tar' | 'Inicio' | 'Deadline' | 'Dificultad' | 'general', string>>;

/**
 * Ingreso de tareas: crea un registro en la tabla tareas. Hora_Reg e ID_Tar
 * los asigna el backend.
 */
export default function NuevaTareaScreen() {
  const [nombre, setNombre] = useState('');
  const [inicio, setInicio] = useState<Date | null>(null);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [dificultad, setDificultad] = useState<Dificultad>(1);
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);
  const [celebrando, setCelebrando] = useState(false);

  useEffect(() => {
    if (!celebrando) return;
    const timer = setTimeout(() => setCelebrando(false), 1800);
    return () => clearTimeout(timer);
  }, [celebrando]);

  function limpiar() {
    setNombre('');
    setInicio(null);
    setDeadline(null);
    setDificultad(1);
    setErrores({});
  }

  function cancelar() {
    limpiar();
    volver();
  }

  function validar(): Errores {
    const encontrados: Errores = {};
    if (!nombre.trim()) {
      encontrados.Nom_Tar = 'Ponle un nombre a la tarea.';
    }
    if (inicio && deadline && deadline < inicio) {
      encontrados.Deadline = 'El deadline no puede ser antes del inicio.';
    }
    return encontrados;
  }

  async function ingresar() {
    const encontrados = validar();
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    try {
      await crearTarea({
        Nom_Tar: nombre.trim(),
        Inicio: inicio ? aFechaApi(inicio) : null,
        Deadline: deadline ? aFechaApi(deadline) : null,
        Dificultad: dificultad,
      });
      limpiar();
      setCelebrando(true);
    } catch (error) {
      setErrores(erroresDesde(error));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.pantalla}>
      <CoffeeBeans />

      <ScreenHeader titulo="Ingreso de Tareas" />

      <ScrollView contentContainerStyle={styles.formulario} keyboardShouldPersistTaps="handled">
        <View>
          <Text style={estilosCampo.etiqueta}>Nombre de la tarea</Text>
          <TextInput
            value={nombre}
            onChangeText={(texto) => {
              setNombre(texto);
              if (errores.Nom_Tar) setErrores({ ...errores, Nom_Tar: undefined });
            }}
            placeholder="Ej.: Estudiar para la prueba"
            placeholderTextColor={Cafe.caramelo}
            maxLength={MAX_NOMBRE}
            style={[estilosCampo.campo, styles.input, errores.Nom_Tar && estilosCampo.campoError]}
          />
          <View style={styles.filaAyuda}>
            <Text style={estilosCampo.error}>{errores.Nom_Tar ?? ''}</Text>
            <Text style={styles.contador}>
              {nombre.length}/{MAX_NOMBRE}
            </Text>
          </View>
        </View>

        <DateField etiqueta="Inicio" valor={inicio} onChange={setInicio} error={errores.Inicio} />

        <DateField
          etiqueta="Deadline"
          valor={deadline}
          onChange={setDeadline}
          minimo={inicio}
          error={errores.Deadline}
        />

        <View>
          <Text style={estilosCampo.etiqueta}>Dificultad</Text>
          <DifficultySlider valor={dificultad} onChange={setDificultad} />
          {errores.Dificultad && <Text style={estilosCampo.error}>{errores.Dificultad}</Text>}
        </View>

        {errores.general && <Text style={[estilosCampo.error, styles.errorGeneral]}>{errores.general}</Text>}
      </ScrollView>

      <View style={styles.botones}>
        <Sticker onPress={cancelar} disabled={enviando} style={styles.boton} contentStyle={styles.botonContenido}>
          <Text style={styles.textoCancelar}>Cancelar</Text>
        </Sticker>
        <Sticker
          onPress={ingresar}
          disabled={enviando}
          color={Cafe.caramelo}
          style={[styles.boton, enviando && styles.deshabilitado]}
          contentStyle={styles.botonContenido}>
          <Text style={styles.textoIngresar}>{enviando ? 'Ingresando…' : 'Ingresar Tarea'}</Text>
        </Sticker>
      </View>

      <CelebrationToast visible={celebrando} mensaje="Tarea Ingresada :D" />
    </SafeAreaView>
  );
}

function erroresDesde(error: unknown): Errores {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 422) {
      const porCampo: Record<string, string[]> = error.response?.data?.errors ?? {};
      return Object.fromEntries(Object.entries(porCampo).map(([campo, mensajes]) => [campo, mensajes[0]]));
    }
    if (status === 401) {
      return { general: 'No hay sesión. Genera el token demo con "php artisan cota:token-demo".' };
    }
  }
  return { general: 'No pudimos conectar con el servidor. Tus datos siguen aquí, inténtalo de nuevo.' };
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: Cafe.crema,
  },
  formulario: {
    padding: 24,
    gap: 20,
  },
  input: {
    fontFamily: Tipografia.texto,
    fontSize: 16,
    color: Cafe.espresso,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  filaAyuda: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contador: {
    fontFamily: Tipografia.texto,
    fontSize: 12,
    color: Cafe.cafe,
    marginTop: 4,
  },
  errorGeneral: {
    textAlign: 'center',
  },
  botones: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  boton: {
    flex: 1,
  },
  botonContenido: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  deshabilitado: {
    opacity: 0.6,
  },
  textoCancelar: {
    fontFamily: Tipografia.textoFuerte,
    fontSize: 16,
    color: Cafe.espresso,
  },
  textoIngresar: {
    fontFamily: Tipografia.textoFuerte,
    fontSize: 16,
    color: Cafe.espuma,
  },
});
