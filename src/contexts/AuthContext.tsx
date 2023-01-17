import { createContext, ReactNode, useEffect, useState } from "react";
import { UserDto } from "@dto/UserDTO";
import { api } from "@service/api";
import {
  getStoragedUser,
  removeStoragedUser,
  storageUser,
} from "@storage/storage";

export type AuthContextProps = {
  user: UserDto;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};
export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<UserDto>({} as UserDto);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/sessions", { email, password });
      if (data.user) {
        setUser(data.user);
        storageUser(data.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setUser({} as UserDto);
      await removeStoragedUser();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const loggedUser = await getStoragedUser();
      if (loggedUser) {
        setUser(loggedUser);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
