import { createContext, ReactNode, useEffect, useState } from "react";

import { api } from "@service/api";
import {
  getStoragedUser,
  removeStoragedUser,
  storageUser,
} from "@storage/storage";
import {
  getStoragedToken,
  removeStoragedToken,
  storageToken,
} from "@storage/storegeToken";

import { UserDto } from "@dto/UserDTO";

export type AuthContextProps = {
  user: UserDto;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: UserDto) => Promise<void>;
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

  const storageUserAndToken = async (user: UserDto, token: string) => {
    try {
      setLoading(true);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      await storageUser(user);
      await storageToken(token);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/sessions", { email, password });
      if (data.user && data.token) {
        storageUserAndToken(data.user, data.token);
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
      await removeStoragedToken();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const loggedUser = await getStoragedUser();
      const token = await getStoragedToken();
      if (loggedUser && token) {
        setUser(loggedUser);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (user: UserDto) => {
    try {
      setUser(user);
      await storageUser(user);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const subscribe = api.registerInterpectorTokenManager(signOut);
    return () => {
      subscribe();
    };
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
