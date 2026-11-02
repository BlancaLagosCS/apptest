const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const dosDigitos = (n: number) => String(n).padStart(2, '0');

/**
 * Fecha en hora local del teléfono con el formato que espera Laravel (Y-m-d H:i:s).
 * Se envía sin zona horaria para que la hora elegida no se desplace.
 */
export function aFechaApi(fecha: Date): string {
  return (
    `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())} ` +
    `${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}:00`
  );
}

/** Convierte "Y-m-d H:i:s" (hora local, como la devuelve Laravel) a Date. */
export function desdeFechaApi(valor: string): Date {
  const [fecha, hora = '00:00:00'] = valor.split(' ');
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const [h, m, s] = hora.split(':').map(Number);
  return new Date(anio, mes - 1, dia, h, m, s);
}

const MS_DIA = 24 * 60 * 60 * 1000;

/**
 * Texto de la fecha límite: "hoy", "mañana", "ayer" o DD/MM.
 * En formato corto (tabla del landing): "hoy", "mañ", "ayer" o solo DD.
 * vencida es true si el deadline ya pasó (incluye hoy con la hora pasada).
 */
export function etiquetaDeadline(
  deadline: string | null,
  ahora = new Date(),
  formato: 'largo' | 'corto' = 'largo'
): { texto: string; vencida: boolean } | null {
  if (!deadline) {
    return null;
  }

  const fecha = desdeFechaApi(deadline);
  const diaFecha = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  const diaHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const diferencia = Math.round((diaFecha.getTime() - diaHoy.getTime()) / MS_DIA);

  const corto = formato === 'corto';
  const texto =
    diferencia === 0
      ? 'hoy'
      : diferencia === 1
        ? corto ? 'mañ' : 'mañana'
        : diferencia === -1
          ? 'ayer'
          : corto
            ? dosDigitos(fecha.getDate())
            : `${dosDigitos(fecha.getDate())}/${dosDigitos(fecha.getMonth() + 1)}`;

  return { texto, vencida: fecha.getTime() < ahora.getTime() };
}

/** Ej.: "mié 5 nov · 18:00" */
export function formatearFecha(fecha: Date): string {
  return (
    `${DIAS[fecha.getDay()]} ${fecha.getDate()} ${MESES[fecha.getMonth()]} · ` +
    `${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}`
  );
}
