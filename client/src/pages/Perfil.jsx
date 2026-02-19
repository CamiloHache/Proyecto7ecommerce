import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { Link } from "react-router-dom";
import "./Perfil.css";

const Perfil = () => {
  const { user, token, updateProfile } = useContext(UserContext);
  const [nombre, setNombre] = useState(user?.nombre || "");
  const [email, setEmail] = useState(user?.email || "");
  const [orders, setOrders] = useState([]);
  const [productImageById, setProductImageById] = useState({});
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:4000",
    []
  );
  const getOrderCode = (order) => {
    const existing = String(order?.codigoPedido || "").trim();
    if (existing) return existing;
    const digitsSource = String(order?.numeroPedido || order?._id || "").replace(/\D/g, "");
    const numericPart = digitsSource.slice(-5).padStart(5, "0");
    return `SO${numericPart}`;
  };

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/users/me/orders`, {
          headers: { "x-auth-token": token },
        });
        setOrders(res.data);
      } catch {
        setOrders([]);
      }
    };
    if (token) getOrders();
  }, [apiUrl, token]);

  useEffect(() => {
    const loadMissingThumbnails = async () => {
      const idsToResolve = Array.from(
        new Set(
          orders
            .map((order) => order.items?.[0])
            .filter(
              (item) =>
                item &&
                !item.imagen &&
                item.productId &&
                !productImageById[String(item.productId)]
            )
            .map((item) => String(item.productId))
        )
      );
      if (!idsToResolve.length) return;

      const results = await Promise.allSettled(
        idsToResolve.map((id) => axios.get(`${apiUrl}/api/products/${id}`))
      );

      const resolvedImages = {};
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const data = result.value.data || {};
          const image = data.imagen || data.image || "";
          if (image) {
            resolvedImages[idsToResolve[index]] = image;
          }
        }
      });

      if (Object.keys(resolvedImages).length > 0) {
        setProductImageById((prev) => ({ ...prev, ...resolvedImages }));
      }
    };
    if (orders.length > 0) {
      loadMissingThumbnails();
    }
  }, [apiUrl, orders, productImageById]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    const res = await updateProfile({
      nombre: nombre || user?.nombre || "",
      email: email || user?.email || "",
    });
    if (res.success) setMsg("Datos actualizados correctamente.");
    else setError(res.msg);
  };

  return (
    <section className="perfil-page">
      <h1>Mi perfil</h1>
      <p className="perfil-intro">
        Esta es tu area privada de usuario.
      </p>

      <div className="perfil-grid">
        <form className="perfil-card" onSubmit={handleSubmit}>
          <h2>Datos personales</h2>
          <label htmlFor="perfil-nombre">Nombre</label>
          <input
            id="perfil-nombre"
            value={nombre || user?.nombre || ""}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label htmlFor="perfil-email">Email</label>
          <input
            id="perfil-email"
            type="email"
            value={email || user?.email || ""}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <p className="perfil-role">
            <strong>Rol:</strong> {user?.rol || "cliente"}
          </p>
          {msg ? <p className="perfil-msg-ok">{msg}</p> : null}
          {error ? <p className="perfil-msg-error">{error}</p> : null}
          <button type="submit">Guardar cambios</button>
        </form>

        <div className="perfil-card">
          <h2>Mis compras</h2>
          {orders.length === 0 ? (
            <p>Aun no registras compras.</p>
          ) : (
            <ul className="perfil-orders">
              {orders.map((order) => (
                <li key={order._id}>
                  <div className="perfil-order-thumb-wrap">
                    {order.items?.[0]?.imagen ||
                    (order.items?.[0]?.productId &&
                      productImageById[String(order.items[0].productId)]) ? (
                      <img
                        src={
                          order.items[0].imagen ||
                          productImageById[String(order.items[0].productId)] ||
                          ""
                        }
                        alt={order.items[0].nombre || "Producto comprado"}
                        className="perfil-order-thumb"
                      />
                    ) : (
                      <div className="perfil-order-thumb-fallback" aria-hidden="true">
                        {order.items?.[0]?.nombre?.slice(0, 1)?.toUpperCase() || "M"}
                      </div>
                    )}
                  </div>
                  <div className="perfil-order-main">
                    <span>
                      {getOrderCode(order)} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString("es-CL")} - $
                      {Number(order.total || 0).toLocaleString("es-CL")}
                    </span>
                    <span className={`estado estado-${order.estado}`}>
                      {order.estado}
                    </span>
                  </div>
                  <Link className="perfil-order-link" to={`/mis-compras/${order._id}`}>
                    Ver detalle
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default Perfil;
