import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAxiosError } from 'axios';

import { registrarEmocion } from '@/lib/api';
import { getToken } from '@/lib/session';

const PENDING_KEY = 'emociones_pendientes';
const LAST_KEY = 'ultima_emocion';

type RegistroPendiente = { ID_Emo: number; fecha: string };

/**
 * Guarda la emoción elegida en el dispositivo. Se envía al backend cuando
 * el cliente tiene sesión iniciada (registro_emociones exige ID_Usu).
 */
export async function guardarEmocion(idEmo: number): Promise<void> {
  const registro: RegistroPendiente = { ID_Emo: idEmo, fecha: new Date().toISOString() };
  const pendientes = await leerPendientes();

  await AsyncStorage.multiSet([
    [PENDING_KEY, JSON.stringify([...pendientes, registro])],
    [LAST_KEY, String(idEmo)],
  ]);
}

export async function getUltimaEmocion(): Promise<number | null> {
  const valor = await AsyncStorage.getItem(LAST_KEY);
  return valor ? Number(valor) : null;
}

/**
 * Envía las emociones pendientes. Llamar al abrir la app y después de iniciar sesión.
 * Las que fallen se conservan para el siguiente intento.
 */
export async function sincronizarEmociones(): Promise<void> {
  if (!(await getToken())) {
    return;
  }

  const restantes: RegistroPendiente[] = [];
  for (const registro of await leerPendientes()) {
    try {
      await registrarEmocion(registro.ID_Emo, registro.fecha);
    } catch (error) {
      // Un 422 significa datos inválidos: reintentar no lo arreglaría.
      if (isAxiosError(error) && error.response?.status === 422) {
        continue;
      }
      console.warn('No se pudo enviar la emoción pendiente', error);
      restantes.push(registro);
    }
  }

  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(restantes));
}

async function leerPendientes(): Promise<RegistroPendiente[]> {
  const valor = await AsyncStorage.getItem(PENDING_KEY);
  return valor ? JSON.parse(valor) : [];
}
