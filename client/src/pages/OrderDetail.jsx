import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";
import "./OrderDetail.css";

const adminStates = ["recibido", "procesado", "entregado"];
const getOrderCode = (order) =>
  order?.codigoPedido || `SO${String(order?._id || "").slice(-4).toUpperCase()}`;

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = useContext(UserContext);
  const isAdminRoute = location.pathname.startsWith("/ventas/");
  const isAdmin = isAdminRoute || user?.rol === "admin";
  const apiUrl = useMemo(() => import.meta.env.VITE_API_URL || "http://localhost:4000", []);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editState, setEditState] = useState("recibido");
  const [editNota, setEditNota] = useState("");
  const [editMedioPago, setEditMedioPago] = useState("stripe");

  useEffect(() => {
    const loadOrder = async () => {
      if (!token) return;
      setLoading(true);
      setError("");
      try {
        const endpoint = isAdminRoute
          ? `${apiUrl}/api/admin/orders/${id}`
          : `${apiUrl}/api/users/me/orders/${id}`;
        const res = await axios.get(endpoint, { headers: { "x-auth-token": token } });
        setOrder(res.data);
        setEditState(res.data.estado || "recibido");
        setEditNota(res.data.notaContacto || "");
        setEditMedioPago(res.data.medioPago || "stripe");
      } catch (err) {
        try {
          const fallbackEndpoint = isAdminRoute
            ? `${apiUrl}/api/admin/orders`
            : `${apiUrl}/api/users/me/orders`;
          const fallbackRes = await axios.get(fallbackEndpoint, {
            headers: { "x-auth-token": token },
          });
          const found = (fallbackRes.data || []).find((o) => String(o._id) === String(id));
          if (!found) {
            setError("No se pudo cargar la venta");
          } else {
            setOrder(found);
            setEditState(found.estado || "recibido");
            setEditNota(found.notaContacto || "");
            setEditMedioPago(found.medioPago || "stripe");
          }
        } catch (fallbackErr) {
          setError(
            fallbackErr.response?.data?.msg ||
              err.response?.data?.msg ||
              "No se pudo cargar la venta"
          );
        }
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [apiUrl, id, isAdminRoute, token]);

  const saveOrder = async () => {
    setMessage("");
    setError("");
    try {
      const res = await axios.put(
        `${apiUrl}/api/admin/orders/${id}`,
        { estado: editState, notaContacto: editNota, medioPago: editMedioPago },
        { headers: { "x-auth-token": token } }
      );
      setOrder((prev) => ({ ...prev, ...res.data }));
      setMessage("Venta actualizada.");
    } catch (err) {
      setError(err.response?.data?.msg || "No se pudo actualizar la venta");
    }
  };

  const deleteDeliveredOrder = async () => {
    setMessage("");
    setError("");
    try {
      await axios.delete(`${apiUrl}/api/admin/orders/${id}`, {
        headers: { "x-auth-token": token },
      });
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.msg || "No se pudo eliminar la venta");
    }
  };

  if (loading) return <section className="order-detail-page"><p>Cargando venta...</p></section>;
  if (error) return <section className="order-detail-page"><p className="order-detail-error">{error}</p></section>;
  if (!order) return null;

  return (
    <section className="order-detail-page">
      <div className="order-detail-head">
        <h1>
          {isAdmin
            ? `Pedido interno ${order.numeroPedido || order._id}`
            : `Pedido ${getOrderCode(order)}`}
        </h1>
        <Link to={isAdmin ? "/admin" : "/perfil"} className="order-detail-back">
          Volver
        </Link>
      </div>

      <div className="order-detail-grid">
        <article className="order-detail-card">
          <h2>Datos de la venta</h2>
          <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleString("es-CL")}</p>
          <p><strong>Total:</strong> ${Number(order.total || 0).toLocaleString("es-CL")}</p>
          {!isAdmin ? (
            <p>
              <strong>Número de pedido:</strong> {getOrderCode(order)}
            </p>
          ) : null}
          <p><strong>Estado:</strong> {order.estado}</p>
          <p><strong>Medio de pago:</strong> {order.medioPago || "stripe"}</p>
          <p><strong>Procesado por:</strong> {order.actualizadoPorNombre || "Sin asignar"}</p>
          {order.user ? (
            <>
              <p><strong>Cliente:</strong> {order.user.nombre || "Cliente"}</p>
              <p><strong>Email:</strong> {order.user.email || "-"}</p>
            </>
          ) : null}
        </article>

        <article className="order-detail-card">
          <h2>Productos</h2>
          <ul className="order-detail-items">
            {(order.items || []).map((item, idx) => (
              <li key={`${item.productId || idx}`}>
                <span>{item.nombre}</span>
                <span>
                  {item.quantity} x ${Number(item.precio || 0).toLocaleString("es-CL")}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className="order-detail-card">
        <h2>Seguimiento</h2>
        {isAdmin ? (
          <>
            <div className="order-detail-controls">
              <select value={editState} onChange={(e) => setEditState(e.target.value)}>
                {adminStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <select value={editMedioPago} onChange={(e) => setEditMedioPago(e.target.value)}>
                <option value="stripe">stripe</option>
                <option value="transferencia">transferencia</option>
              </select>
            </div>
            <textarea
              rows={4}
              value={editNota}
              onChange={(e) => setEditNota(e.target.value)}
              placeholder="Notas para coordinación de entrega"
            />
            <div className="order-detail-actions">
              <button type="button" onClick={saveOrder}>Guardar cambios</button>
              {order.estado === "entregado" || editState === "entregado" ? (
                <button type="button" className="danger" onClick={deleteDeliveredOrder}>
                  Eliminar venta entregada
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <p>
            Tu pedido está en estado <strong>{order.estado}</strong>. Te contactaremos por correo para coordinar la entrega.
          </p>
        )}
        {message ? <p className="order-detail-ok">{message}</p> : null}
        {error ? <p className="order-detail-error">{error}</p> : null}
      </article>
    </section>
  );
};

export default OrderDetail;
