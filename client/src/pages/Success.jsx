import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/cartContext";

const Success = () => {
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <section style={{ padding: "2rem 1rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Compra realizada con exito
      </h1>
      <p style={{ color: "#374151", marginBottom: "1.5rem", lineHeight: 1.6 }}>
        Tu pago fue procesado correctamente. Gracias por apoyar el proyecto Memorice.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link
          to="/"
          style={{
            backgroundColor: "#111827",
            color: "#fff",
            borderRadius: "999px",
            padding: "0.7rem 1rem",
            textDecoration: "none",
          }}
        >
          Volver al inicio
        </Link>

        <Link
          to="/productos"
          style={{
            border: "1px solid #111827",
            color: "#111827",
            borderRadius: "999px",
            padding: "0.7rem 1rem",
            textDecoration: "none",
          }}
        >
          Volver al catalogo
        </Link>
      </div>
    </section>
  );
};

export default Success;
