/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", { email, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.response?.data?.msg || "Error al conectar" };
    }
  };

  const register = async (nombre, email, password) => {
    try {
      await axios.post("http://localhost:4000/api/auth/register", { nombre, email, password });
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.response?.data?.msg || "Error al registrar" };
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
};