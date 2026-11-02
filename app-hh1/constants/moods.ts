import { Cafe } from '@/constants/theme';

export type Animo = 'mal' | 'bien' | 'excelente';

export type OpcionAnimo = {
  /** ID_Emo de la tabla tip_emo. */
  id: number;
  nombre: string;
  animo: Animo;
  color: string;
  mensaje: string;
};

/**
 * Opciones de la pantalla previa al landing. Coinciden con TipEmoSeeder del backend
 * y sirven de respaldo cuando la API no responde.
 */
export const OPCIONES_ANIMO: OpcionAnimo[] = [
  {
    id: 1,
    nombre: 'Mal',
    animo: 'mal',
    color: Cafe.animo.mal,
    mensaje: 'Un día difícil. Prepárate algo calentito y vamos paso a paso.',
  },
  {
    id: 2,
    nombre: 'Bien',
    animo: 'bien',
    color: Cafe.animo.bien,
    mensaje: '¡Qué bueno! Sigamos a buen ritmo, como un café recién hecho.',
  },
  {
    id: 3,
    nombre: 'Excelente',
    animo: 'excelente',
    color: Cafe.animo.excelente,
    mensaje: '¡Día de espresso doble! Aprovechemos toda esa energía.',
  },
];

export function opcionPorId(id: number | null): OpcionAnimo | undefined {
  return OPCIONES_ANIMO.find((opcion) => opcion.id === id);
}
