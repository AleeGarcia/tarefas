import axios from "axios";
import { ReactNode, createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDTO } from "../types/User";
import { showError } from "../components/Toast"; // toast??

type UserContextProps = {
  token: string;
  setToken: (token: string) => void;
  getToken: () => void;
  user: UserDTO | null;
  setUser: (user: UserDTO) => void;
  getUser: () => void;
  login: (username: string, password: string) => void;
  logout: () => void;
};

type UserProviderProps = {
  children: ReactNode;
};

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
);

export const UserContextProvider = ({ children }: UserProviderProps) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<UserDTO | null>(null);

  const storeToken = async (value: string) => {
    try {
      await AsyncStorage.setItem("@token", value);
    } catch (error) {
      showError("Não foi possível salvar o token");
    }
  };

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("@token");

      if (value !== null) {
        setToken(value);
      }
    } catch (error) {
      showError("Não foi possível recuperar o token");
    }
  };

  const storeUser = async (value: UserDTO) => {
    try {
      const jsonValue = JSON.stringify(value);

      await AsyncStorage.setItem("@user", jsonValue);
    } catch (error) {
      showError("Não foi possível salvar os dados do usuário");
    }
  };

  const getUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@user");
      const userData = jsonValue !== null ? JSON.parse(jsonValue) : null;

      setUser(userData);
    } catch (error) {
      showError("Não foi possível recuperar o usuário");
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const url = "https://dummyjson.com/auth/login";

      const response = await axios.post<UserDTO>(url, {
        username,
        password,
      });

      setUser(response.data);
      storeUser(response.data);
      setToken(response.data.token);
      storeToken(response.data.token);
    } catch (error) {
      showError("Não foi possível realizar o login");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("@token");
    await AsyncStorage.removeItem("@user");
    setToken("");
    await AsyncStorage.removeItem("@cart");
  };

  return (
    <UserContext.Provider
      value={{
        token,
        setToken,
        getToken,
        user,
        setUser,
        getUser,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};