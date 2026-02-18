/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(UserContext);
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    if (!token) return;
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item._id === product._id);
      if (exists) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  useEffect(() => {
    // Requisito de rúbrica: carrito disponible solo con sesión activa.
    if (!token) {
      setCart([]);
    }
  }, [token]);

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalPrice = cart.reduce(
    (acc, item) => acc + ((item.precio || 0) * (item.quantity || 1)),
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};