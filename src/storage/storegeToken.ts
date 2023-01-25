import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_STORAGE } from "./storageConfig";
export const storageToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_STORAGE, token);
};

export const getStoragedToken = async () => {
  return await AsyncStorage.getItem(TOKEN_STORAGE);
};

export const removeStoragedToken = async () => {
  return await AsyncStorage.removeItem(TOKEN_STORAGE);
};
