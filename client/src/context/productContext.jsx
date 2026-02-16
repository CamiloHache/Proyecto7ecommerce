/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/products");
        const normalizedProducts = res.data.map((product) => ({
          ...product,
          nombre: product.nombre ?? product.name ?? "",
          precio: product.precio ?? product.price ?? 0,
          imagen: product.imagen ?? product.image ?? "",
        }));
        setProducts(normalizedProducts);
      } catch (error) {
        console.error("Error obteniendo productos:", error);
      }
    };
    getProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};