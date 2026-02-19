/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { UserContext } from "./userContext";

export const CartContext = createContext();
const CART_STORAGE_KEY = "memoriceCartState";
const CART_TTL_MS = 10 * 60 * 1000;
const PENDING_ORDER_CODE_KEY = "pendingOrderCode";

export const CartProvider = ({ children }) => {
  const { token, user } = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const [reservedOrderCode, setReservedOrderCode] = useState("");
  const canUseCart = !!token && user?.rol !== "admin";
  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:4000",
    []
  );
  const userKey = useMemo(
    () => user?.id || user?._id || user?.email || "anon",
    [user]
  );

  const persistCart = useCallback(
    (nextCart) => {
      if (!canUseCart) return;
      const payload = {
        userKey,
        items: nextCart,
        lastUpdatedAt: Date.now(),
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
    },
    [canUseCart, userKey]
  );

  const reserveOrderCodeIfNeeded = useCallback(async () => {
    if (!canUseCart || reservedOrderCode) return reservedOrderCode;
    try {
      const res = await axios.get(`${apiUrl}/api/checkout/reserve-order-code`, {
        headers: { "x-auth-token": token },
      });
      const code = String(res.data?.codigoPedido || "").trim();
      if (code) {
        setReservedOrderCode(code);
        localStorage.setItem(PENDING_ORDER_CODE_KEY, code);
      }
      return code;
    } catch {
      return "";
    }
  }, [apiUrl, canUseCart, reservedOrderCode, token]);

  const addToCart = (product) => {
    if (!canUseCart) return;
    reserveOrderCodeIfNeeded();
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item._id === product._id);
      let nextCart;
      if (exists) {
        nextCart = prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      } else {
        nextCart = [...prevCart, { ...product, quantity: 1 }];
      }
      persistCart(nextCart);
      return nextCart;
    });
  };

  useEffect(() => {
    // Carrito activo solo para usuario cliente con sesión.
    if (!canUseCart) {
      setCart([]);
      setReservedOrderCode("");
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(PENDING_ORDER_CODE_KEY);
      return;
    }
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const isSameUser = parsed?.userKey === userKey;
      const isExpired = !parsed?.lastUpdatedAt || Date.now() - parsed.lastUpdatedAt > CART_TTL_MS;
      if (!isSameUser || isExpired) {
        localStorage.removeItem(CART_STORAGE_KEY);
        setCart([]);
        return;
      }
      setCart(Array.isArray(parsed.items) ? parsed.items : []);
      const savedCode = String(localStorage.getItem(PENDING_ORDER_CODE_KEY) || "").trim();
      setReservedOrderCode(savedCode);
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(PENDING_ORDER_CODE_KEY);
      setCart([]);
      setReservedOrderCode("");
    }
  }, [canUseCart, userKey]);

  useEffect(() => {
    if (!canUseCart) return;
    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const isExpired =
          !parsed?.lastUpdatedAt || Date.now() - parsed.lastUpdatedAt > CART_TTL_MS;
        if (isExpired) {
          localStorage.removeItem(CART_STORAGE_KEY);
          localStorage.removeItem(PENDING_ORDER_CODE_KEY);
          setCart([]);
          setReservedOrderCode("");
        }
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
        localStorage.removeItem(PENDING_ORDER_CODE_KEY);
        setCart([]);
        setReservedOrderCode("");
      }
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, [canUseCart]);

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const next = prev.filter((item) => item._id !== productId);
      persistCart(next);
      return next;
    });
  };

  const clearCart = useCallback(() => {
    setCart([]);
    setReservedOrderCode("");
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(PENDING_ORDER_CODE_KEY);
  }, []);

  const totalPrice = cart.reduce(
    (acc, item) => acc + ((item.precio || 0) * (item.quantity || 1)),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
        reservedOrderCode,
        reserveOrderCodeIfNeeded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};