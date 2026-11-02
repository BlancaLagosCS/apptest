import { Modal, StyleSheet, Text, View } from 'react-native';

import { Sticker } from '@/components/cafe/sticker';
import { Cafe, Tipografia } from '@/constants/theme';

type Props = {
  visible: boolean;
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
};

/**
 * Diálogo de confirmación Sí / No con el estilo de la app.
 */
export function ConfirmDialog({ visible, mensaje, onConfirmar, onCancelar }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar} statusBarTranslucent>
      <View style={styles.fondo}>
        <Sticker style={styles.caja} contentStyle={styles.contenido}>
          <Text style={styles.mensaje}>{mensaje}</Text>
          <View style={styles.botones}>
            <Sticker onPress={onCancelar} style={styles.boton} contentStyle={styles.botonContenido}>
              <Text style={styles.textoNo}>No</Text>
            </Sticker>
            <Sticker onPress={onConfirmar} color={Cafe.rubor} style={styles.boton} contentStyle={styles.botonContenido}>
              <Text style={styles.textoSi}>Sí</Text>
            </Sticker>
          </View>
        </Sticker>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: 'rgba(91, 62, 43, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  caja: {
    width: '100%',
    maxWidth: 360,
  },
  contenido: {
    padding: 22,
  },
  mensaje: {
    fontFamily: Tipografia.titulo,
    fontSize: 20,
    lineHeight: 26,
    color: Cafe.espresso,
    textAlign: 'center',
  },
  botones: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 20,
  },
  boton: {
    flex: 1,
  },
  botonContenido: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  textoNo: {
    fontFamily: Tipografia.textoFuerte,
    fontSize: 16,
    color: Cafe.espresso,
  },
  textoSi: {
    fontFamily: Tipografia.textoFuerte,
    fontSize: 16,
    color: Cafe.burdeo,
  },
});
