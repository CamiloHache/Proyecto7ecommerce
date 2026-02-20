import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../context/cartContext";
import { UserContext } from "../context/userContext";

const Success = () => {
  const { clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const location = useLocation();
  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:4000",
    []
  );
  const [codigoPedido, setCodigoPedido] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");
    if (!orderId) {
      const t = setTimeout(() => {
        setLoading(false);
        setError(true);
      }, 0);
      return () => clearTimeout(t);
    }

    let cancelled = false;
    axios
      .get(`${apiUrl}/api/checkout/order/${orderId}`)
      .then((res) => {
        if (cancelled) return;
        const code = (res.data?.codigoPedido || "").trim();
        if (code) {
          setCodigoPedido(code);
          clearCart();
        } else {
          setError(true);
        }
      })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [apiUrl, clearCart, location.search]);

  return (
    <section style={{ padding: "2rem 1rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Compra realizada con exito
      </h1>
      <p style={{ color: "#374151", marginBottom: "1.5rem", lineHeight: 1.6 }}>
        {loading
          ? "Estamos confirmando tu pedido..."
          : error
            ? "No pudimos cargar el pedido. Contacta a ventas@memorice.cl con tu comprobante."
            : `Hola ${user?.nombre || "cliente"}, tu pago fue procesado correctamente. Tu número de pedido es ${codigoPedido}. Para consultas escríbenos a ventas@memorice.cl. Gracias por apoyar a Proyecto Memorice.`}
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
