import axios from 'axios';

import { getToken } from '@/lib/session';

/**
 * URL pública del backend Laravel expuesta con Ngrok (ver .env.example).
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL || API_URL.includes('tu-subdominio')) {
  console.warn(
    'EXPO_PUBLIC_API_URL no está configurada: copia la URL de Ngrok en app-hh1/.env.local y reinicia Expo con "npx expo start -c".'
  );
}

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 8000,
  headers: {
    Accept: 'application/json',
    // Evita la página de advertencia que Ngrok muestra en el plan gratuito.
    'ngrok-skip-browser-warning': 'true',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type TipEmo = {
  ID_Emo: number;
  Nom_Emo: string;
  Dificultad: number;
};

export async function getEmociones(): Promise<TipEmo[]> {
  const { data } = await api.get<TipEmo[]>('/emociones');
  return data;
}

export async function registrarEmocion(idEmo: number, fecha: string): Promise<void> {
  await api.post('/registro-emociones', { ID_Emo: idEmo, Date_Reg_Emo: fecha });
}

/** 1 = Fácil, 2 = Intermedio, 3 = Difícil */
export type Dificultad = 1 | 2 | 3;

export type NuevaTarea = {
  Nom_Tar: string;
  /** Formato Y-m-d H:i:s en hora local, o null. */
  Inicio: string | null;
  Deadline: string | null;
  Dificultad: Dificultad;
};

export type EstadoTarea = 'Pendiente' | 'Realizada' | 'Eliminada';

export type Tarea = NuevaTarea & {
  ID_Tar: number;
  ID_Cli: number;
  ID_Reg_Emo: number | null;
  Hora_Reg: string;
  Est_Tar: EstadoTarea;
  /** Cuándo se marcó como realizada (Y-m-d H:i:s), o null. */
  Fecha_Real: string | null;
};

export async function crearTarea(tarea: NuevaTarea): Promise<Tarea> {
  const { data } = await api.post<Tarea>('/tareas', tarea);
  return data;
}

/** Pendientes ordenadas por deadline (las sin fecha al final); limite trae solo las primeras. */
export async function listarPendientes(limite?: number): Promise<Tarea[]> {
  const { data } = await api.get<Tarea[]>('/tareas', { params: { estado: 'Pendiente', limite } });
  return data;
}

export async function listarRealizadasHoy(): Promise<Tarea[]> {
  const { data } = await api.get<Tarea[]>('/tareas', { params: { estado: 'Realizada', fecha: 'hoy' } });
  return data;
}

/** Al marcarla Realizada también llegan los granos ganados (Cant_Pun) y el nuevo total (Cont_Tot). */
export type TareaActualizada = Tarea & { Cant_Pun?: number; Cont_Tot?: number };

export async function cambiarEstadoTarea(id: number, estado: EstadoTarea): Promise<TareaActualizada> {
  const { data } = await api.patch<TareaActualizada>(`/tareas/${id}/estado`, { Est_Tar: estado });
  return data;
}

export type Puntos = {
  /** Granos disponibles. */
  Cont_Tot: number;
  /** Granos ganados en total (no baja al gastar). */
  Cont_Hist: number;
};

export async function getPuntos(): Promise<Puntos> {
  const { data } = await api.get<Puntos>('/puntos');
  return data;
}
