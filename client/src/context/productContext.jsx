/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import axios from "axios";

// 1. Creamos el contexto (la "nube" donde vivirán los datos)
export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // 2. useEffect: Se ejecuta una sola vez cuando carga la app
  useEffect(() => {
    const getProducts = async () => {
      try {
        // Pide los datos al servidor (Asegúrate que tu backend corra en el 4000)
        const res = await axios.get("http://localhost:4000/api/products");
        // Guarda los datos en el estado
        setProducts(res.data);
      } catch (error) {
        console.error("Error obteniendo productos:", error);
      }
    };
    getProducts();
  }, []);

  return (
    // 3. Provider: "Reparte" la lista de productos a toda la app
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};