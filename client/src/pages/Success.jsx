import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
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
  const [orderCode, setOrderCode] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadOrderInfo = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get("session_id");
      if (!sessionId) {
        setHasError(true);
        setLoadingOrder(false);
        return;
      }

      try {
        const res = await axios.get(`${apiUrl}/api/checkout/session-status/${sessionId}`);
        const fetchedCode = String(res.data?.orderCode || "").trim();
        if (!fetchedCode) throw new Error("Order code vacío");
        setOrderCode(fetchedCode);
        clearCart();
      } catch {
        setHasError(true);
      } finally {
        setLoadingOrder(false);
      }
    };
    loadOrderInfo();
  }, [apiUrl, clearCart, location.search]);

  return (
    <section style={{ padding: "2rem 1rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Compra realizada con exito
      </h1>
      <p style={{ color: "#374151", marginBottom: "1.5rem", lineHeight: 1.6 }}>
        {loadingOrder
          ? "Estamos confirmando tu pedido..."
          : hasError
            ? "No pudimos confirmar el número de pedido en este momento. Por favor contacta a ventas@memorice.cl."
            : `Hola ${user?.nombre || "cliente"}, tu pago fue procesado correctamente. Tu número de pedido es ${orderCode}. Para consultas por el estado de tu pedido escríbenos a ventas@memorice.cl. Gracias por apoyar a Proyecto Memorice, vuelve pronto a visitarnos.`}
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
