/**
 * Paleta de la app: colores claros con temática sutil de cafetería y estilo dibujo 2D
 * (contornos color café en lugar de negro, sombras planas sin difuminado).
 * La app usa siempre el modo claro.
 */

import { Platform } from 'react-native';

export const Cafe = {
  crema: '#FFF8EE',
  espuma: '#FFFDF8',
  latte: '#EAD7BD',
  caramelo: '#C8925A',
  cafe: '#8A5A3B',
  espresso: '#5B3E2B',
  menta: '#A8D5BA',
  rubor: '#F4B6AE',
  /** Colores de taza para cada estado de ánimo (ID_Emo 1, 2 y 3). */
  animo: {
    mal: '#C9D6E3',
    bien: '#F6D49A',
    excelente: '#F7B7B0',
  },
};

/** Grosor de contorno usado en ilustraciones y tarjetas. */
export const Trazo = 3;

/** Familias cargadas en app/_layout.tsx con @expo-google-fonts. */
export const Tipografia = {
  titulo: 'Fredoka_600SemiBold',
  tituloSuave: 'Fredoka_500Medium',
  texto: 'Nunito_600SemiBold',
  textoFuerte: 'Nunito_800ExtraBold',
};

const light = {
  text: Cafe.espresso,
  background: Cafe.crema,
  tint: Cafe.caramelo,
  icon: Cafe.cafe,
  tabIconDefault: Cafe.cafe,
  tabIconSelected: Cafe.caramelo,
};

export const Colors = {
  light,
  // La app no tiene modo oscuro; se mantiene la clave para los componentes de la plantilla.
  dark: light,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
