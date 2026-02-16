import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/cartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(`http://localhost:4000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Producto no encontrado.");
        } else if (err.response?.status === 400) {
          setError("ID de producto no válido.");
        } else {
          setError("No fue posible cargar el producto.");
        }
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    alert(`${product.nombre} agregado al carrito`);
  };

  if (loading) {
    return (
      <section style={{ padding: "2rem 1rem", maxWidth: "900px", margin: "0 auto" }}>
        <p>Cargando detalle del producto...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ padding: "2rem 1rem", maxWidth: "900px", margin: "0 auto" }}>
        <h1>Detalle de producto</h1>
        <p style={{ color: "#b91c1c" }}>{error}</p>
      </section>
    );
  }

  return (
    <section style={{ padding: "2rem 1rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        {product?.nombre || "Producto sin nombre"}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        <img
          src={product?.imagen}
          alt={product?.nombre || "Producto"}
          style={{
            width: "100%",
            borderRadius: "12px",
            objectFit: "cover",
            maxHeight: "420px",
          }}
        />

        <div>
          <p style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1rem" }}>
            ${Number(product?.precio || 0).toLocaleString("es-CL")}
          </p>
          <p style={{ marginBottom: "1.2rem", color: "#374151", lineHeight: 1.6 }}>
            {product?.descripcion || "Sin descripción disponible."}
          </p>
          <button
            type="button"
            onClick={handleAddToCart}
            style={{
              backgroundColor: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              padding: "0.7rem 1.2rem",
              cursor: "pointer",
            }}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
