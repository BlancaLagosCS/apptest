import { IconButton } from '@/components/cafe/icon-button';
import { BackArrowIcon } from '@/components/cafe/icons';

/**
 * Botón circular de retroceso con flecha dibujada.
 */
export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <IconButton onPress={onPress} accessibilityLabel="Volver" size={46}>
      <BackArrowIcon />
    </IconButton>
  );
}
