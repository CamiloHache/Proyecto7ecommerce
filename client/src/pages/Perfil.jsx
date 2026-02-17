import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import "./Perfil.css";

const Perfil = () => {
  const { user, token, updateProfile } = useContext(UserContext);
  const [nombre, setNombre] = useState(user?.nombre || "");
  const [email, setEmail] = useState(user?.email || "");
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:4000",
    []
  );

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
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("es-CL")} - $
                    {Number(order.total || 0).toLocaleString("es-CL")}
                  </span>
                  <span className={`estado estado-${order.estado}`}>
                    {order.estado}
                  </span>
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
