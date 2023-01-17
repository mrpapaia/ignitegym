import { UserDto } from "@dto/UserDTO";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_STORAGE } from "./storageConfig";

export const storageUser = async (user: UserDto) => {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
};

export const getStoragedUser = async () => {
  const storage = await AsyncStorage.getItem(USER_STORAGE);
  const user: UserDto = storage ? JSON.parse(storage) : {};
  return user;
};

export const removeStoragedUser = async () => {
  await AsyncStorage.removeItem(USER_STORAGE);
};
