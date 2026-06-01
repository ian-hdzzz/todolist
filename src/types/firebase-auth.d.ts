// getReactNativePersistence existe en el bundle de React Native pero los tipos
// principales de firebase/auth no lo incluyen. Este archivo amplía el módulo.
import { Persistence } from "firebase/auth";

declare module "firebase/auth" {
  interface ReactNativeAsyncStorage {
    setItem(key: string, value: string): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
  }

  export function getReactNativePersistence(
    storage: ReactNativeAsyncStorage
  ): Persistence;
}
