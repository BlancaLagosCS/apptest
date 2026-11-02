import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

/**
 * Token del cliente demo (php artisan cota:token-demo). Provisional: se usa
 * mientras no exista el inicio de sesión.
 */
const DEV_TOKEN = process.env.EXPO_PUBLIC_DEV_TOKEN;

/** Token Sanctum del cliente. Se guardará al implementar el inicio de sesión. */
export async function getToken(): Promise<string | null> {
  return (await AsyncStorage.getItem(TOKEN_KEY)) ?? DEV_TOKEN ?? null;
}

export async function setToken(token: string | null): Promise<void> {
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}
