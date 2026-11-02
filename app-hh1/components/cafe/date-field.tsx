import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Cafe, Tipografia, Trazo } from '@/constants/theme';
import { formatearFecha } from '@/lib/dates';

type Props = {
  etiqueta: string;
  valor: Date | null;
  onChange: (fecha: Date | null) => void;
  minimo?: Date | null;
  error?: string;
};

/**
 * Campo de fecha y hora opcional. Abre el calendario nativo de Android y luego
 * el reloj; la ✕ lo deja vacío (null).
 */
export function DateField({ etiqueta, valor, onChange, minimo, error }: Props) {
  function abrir() {
    const inicial = valor ?? minimo ?? new Date();

    DateTimePickerAndroid.open({
      value: inicial,
      mode: 'date',
      minimumDate: minimo ?? undefined,
      onValueChange: (_, fecha) => {
        // El reloj se abre después de cerrar el calendario.
        setTimeout(() => {
          DateTimePickerAndroid.open({
            value: fecha,
            mode: 'time',
            is24Hour: true,
            onValueChange: (_, fechaHora) => onChange(fechaHora),
          });
        }, 0);
      },
    });
  }

  return (
    <View>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <View style={[styles.campo, error && styles.campoError]}>
        <Pressable onPress={abrir} style={styles.toque} accessibilityRole="button" accessibilityLabel={`Elegir ${etiqueta}`}>
          <Text style={[styles.valor, !valor && styles.vacio]}>{valor ? formatearFecha(valor) : 'Sin fecha'}</Text>
        </Pressable>
        {valor && (
          <Pressable onPress={() => onChange(null)} hitSlop={10} accessibilityLabel={`Quitar ${etiqueta}`} style={styles.quitar}>
            <Text style={styles.quitarTexto}>✕</Text>
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

export const estilosCampo = StyleSheet.create({
  etiqueta: {
    fontFamily: Tipografia.textoFuerte,
    fontSize: 15,
    color: Cafe.espresso,
    marginBottom: 6,
  },
  campo: {
    borderWidth: Trazo,
    borderColor: Cafe.espresso,
    borderRadius: 16,
    backgroundColor: Cafe.espuma,
  },
  campoError: {
    borderColor: '#C0574B',
  },
  error: {
    fontFamily: Tipografia.texto,
    fontSize: 13,
    color: '#C0574B',
    marginTop: 4,
  },
});

const styles = StyleSheet.create({
  ...estilosCampo,
  campo: {
    ...estilosCampo.campo,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toque: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  valor: {
    fontFamily: Tipografia.texto,
    fontSize: 16,
    color: Cafe.espresso,
  },
  vacio: {
    color: Cafe.caramelo,
  },
  quitar: {
    paddingHorizontal: 14,
  },
  quitarTexto: {
    fontFamily: Tipografia.textoFuerte,
    fontSize: 16,
    color: Cafe.cafe,
  },
});
