/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

export const UserContext = createContext();
const TOKEN_EXPIRES_KEY = "tokenExpiresAt";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user") || "null")
  );
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    const savedExpiresAt = Number(localStorage.getItem(TOKEN_EXPIRES_KEY) || 0);
    if (!savedToken || !savedExpiresAt || Date.now() > savedExpiresAt) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem(TOKEN_EXPIRES_KEY);
      return null;
    }
    return savedToken;
  });
  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:4000",
    []
  );
  const sessionDurationMs = useMemo(() => {
    const minutes = Number(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES || 120);
    return Number.isFinite(minutes) && minutes > 0 ? minutes * 60 * 1000 : 120 * 60 * 1000;
  }, []);

  useEffect(() => {
    if (!token) return;

    const verifySession = () => {
      const expiresAt = Number(localStorage.getItem(TOKEN_EXPIRES_KEY) || 0);
      if (!expiresAt || Date.now() > expiresAt) {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem(TOKEN_EXPIRES_KEY);
      }
    };

    verifySession();
    const interval = setInterval(verifySession, 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password,
      });

      const { token: tokenResp, user: userResp, nombre } = res.data;
      const expiresAt = Date.now() + sessionDurationMs;

      setToken(tokenResp);
      localStorage.setItem("token", tokenResp);
      localStorage.setItem(TOKEN_EXPIRES_KEY, String(expiresAt));

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
      await axios.post(`${apiUrl}/api/auth/register`, {
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
    localStorage.removeItem(TOKEN_EXPIRES_KEY);
    setUser(null);
    localStorage.removeItem("user");
  };

  const refreshProfile = async (customToken) => {
    try {
      const res = await axios.get(`${apiUrl}/api/users/me`, {
        headers: { "x-auth-token": customToken || token },
      });
      const userData = {
        id: res.data._id || res.data.id,
        nombre: res.data.nombre || "Usuario",
        email: res.data.email || "",
        rol: res.data.rol || "cliente",
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true, user: userData };
    } catch {
      return { success: false, msg: "No fue posible actualizar el perfil" };
    }
  };

  const updateProfile = async (payload) => {
    try {
      const res = await axios.put(`${apiUrl}/api/users/me`, payload, {
        headers: { "x-auth-token": token },
      });
      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, msg: error.response?.data?.msg || "No se pudo actualizar perfil" };
    }
  };

  return (
    <UserContext.Provider
      value={{ user, token, login, logout, register, refreshProfile, updateProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};