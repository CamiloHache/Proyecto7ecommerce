/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:4000",
    []
  );

  useEffect(() => {
    const getProducts = async () => {
      setLoadingProducts(true);
      setProductsError("");
      try {
        const res = await axios.get(`${apiUrl}/api/products`);
        const normalizedProducts = res.data.map((product) => ({
          ...product,
          nombre: product.nombre ?? product.name ?? "",
          precio: product.precio ?? product.price ?? 0,
          imagen: product.imagen ?? product.image ?? "",
        }));
        setProducts(normalizedProducts);
      } catch (error) {
        console.error("Error obteniendo productos:", error);
        setProducts([]);
        setProductsError(
          "Estamos presentando intermitencias en el servicio. Si deseas hacer tu pedido, escríbenos a contacto@memorice.cl y te ayudamos de inmediato."
        );
      } finally {
        setLoadingProducts(false);
      }
    };
    getProducts();
  }, [apiUrl]);

  return (
    <ProductContext.Provider value={{ products, loadingProducts, productsError }}>
      {children}
    </ProductContext.Provider>
  );
};