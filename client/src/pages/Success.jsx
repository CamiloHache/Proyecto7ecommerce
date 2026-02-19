import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../context/cartContext";
import { UserContext } from "../context/userContext";

const getOrderCode = (order) => {
  const existing = String(order?.codigoPedido || "").trim();
  if (existing) return existing;
  const digitsSource = String(order?.numeroPedido || order?._id || "").replace(/\D/g, "");
  const numericPart = digitsSource.slice(-5).padStart(5, "0");
  return `SO${numericPart}`;
};

const Success = () => {
  const { clearCart } = useContext(CartContext);
  const { token, user } = useContext(UserContext);
  const location = useLocation();
  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:4000",
    []
  );
  const [orderCode, setOrderCode] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    const loadOrderInfo = async () => {
      const params = new URLSearchParams(location.search);
      const codeFromQuery = (params.get("order_code") || "").trim();
      if (codeFromQuery) {
        setOrderCode(codeFromQuery);
      }
      if (!token) {
        setLoadingOrder(false);
        return;
      }
      const sessionId = params.get("session_id");
      try {
        const endpoint = sessionId
          ? `${apiUrl}/api/users/me/orders/by-session/${sessionId}`
          : `${apiUrl}/api/users/me/orders/latest`;
        const res = await axios.get(endpoint, {
          headers: { "x-auth-token": token },
        });
        setOrderCode(getOrderCode(res.data));
      } catch {
        setOrderCode("");
      } finally {
        setLoadingOrder(false);
      }
    };
    loadOrderInfo();
  }, [apiUrl, location.search, token]);

  return (
    <section style={{ padding: "2rem 1rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Compra realizada con exito
      </h1>
      <p style={{ color: "#374151", marginBottom: "1.5rem", lineHeight: 1.6 }}>
        {loadingOrder
          ? "Estamos confirmando tu pedido..."
          : `Hola ${user?.nombre || "cliente"}, tu pago fue procesado correctamente.${
              orderCode ? ` Tu número de pedido es ${orderCode}.` : ""
            } Para consultas por el estado de tu pedido escríbenos a ventas@memorice.cl. Gracias por apoyar a Proyecto Memorice, vuelve pronto a visitarnos.`}
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
