/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "./userContext";

export const CartContext = createContext();
const CART_STORAGE_KEY = "memoriceCartState";
const CART_TTL_MS = 10 * 60 * 1000;

export const CartProvider = ({ children }) => {
  const { token, user } = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const canUseCart = !!token && user?.rol !== "admin";
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

  const addToCart = (product) => {
    if (!canUseCart) return;
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
      localStorage.removeItem(CART_STORAGE_KEY);
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
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
      setCart([]);
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
          setCart([]);
        }
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
        setCart([]);
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
    localStorage.removeItem(CART_STORAGE_KEY);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};