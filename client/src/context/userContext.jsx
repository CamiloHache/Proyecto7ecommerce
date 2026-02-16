/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user") || "null")
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });

      const { token: tokenResp, user: userResp, nombre } = res.data;

      setToken(tokenResp);
      localStorage.setItem("token", tokenResp);

      const userData = userResp
        ? {
            id: userResp.id,
            nombre: userResp.nombre || "Usuario",
            email: userResp.email || email,
            rol: userResp.rol || "cliente",
          }
        : (nombre ? { nombre } : { nombre: email.split("@")[0] || "Usuario" });

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return { success: false, msg: error.response?.data?.msg || "Error al conectar" };
    }
  };

  const register = async (nombre, email, password) => {
    try {
      await axios.post("http://localhost:4000/api/auth/register", {
        nombre,
        email,
        password,
      });
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.response?.data?.msg || "Error al registrar" };
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
};