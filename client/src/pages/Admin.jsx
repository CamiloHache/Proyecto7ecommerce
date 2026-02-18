/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";
import "./Admin.css";

const initialProduct = {
  nombre: "",
  descripcion: "",
  precio: "",
  imagen: "",
  stock: "",
  categoria: "",
  activo: true,
  ordenCatalogo: 0,
};

const initialNews = {
  titulo: "",
  contenido: "",
  imagen: "",
  publicada: true,
};

const initialUser = {
  nombre: "",
  email: "",
  password: "",
  rol: "cliente",
};

const getOrderCode = (order) => {
  const existing = String(order?.codigoPedido || "").trim();
  if (existing) return existing;
  const digitsSource = String(order?.numeroPedido || order?._id || "").replace(/\D/g, "");
  const numericPart = digitsSource.slice(-5).padStart(5, "0");
  return `SO${numericPart}`;
};

const FEEDBACK_TIMEOUT_MS = 4200;

const Admin = () => {
  const { token } = useContext(UserContext);
  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:4000",
    []
  );
  const authConfig = useMemo(() => ({ headers: { "x-auth-token": token } }), [token]);

  const [activeTab, setActiveTab] = useState("productos");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [news, setNews] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [productForm, setProductForm] = useState(initialProduct);
  const [editingProductId, setEditingProductId] = useState("");

  const [editingUser, setEditingUser] = useState({});
  const [newUserForm, setNewUserForm] = useState(initialUser);
  const [editingContact, setEditingContact] = useState({});

  const [newsForm, setNewsForm] = useState(initialNews);
  const [editingNewsId, setEditingNewsId] = useState("");
  const feedbackTimerRef = useRef(null);

  const clearFeedbackTimer = useCallback(() => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  }, []);

  const clearFeedback = useCallback(() => {
    clearFeedbackTimer();
    setMessage("");
    setError("");
  }, [clearFeedbackTimer]);

  const showMessage = useCallback(
    (text) => {
      clearFeedbackTimer();
      setError("");
      setMessage(text);
      feedbackTimerRef.current = setTimeout(() => setMessage(""), FEEDBACK_TIMEOUT_MS);
    },
    [clearFeedbackTimer]
  );

  const showError = useCallback(
    (text) => {
      clearFeedbackTimer();
      setMessage("");
      setError(text);
      feedbackTimerRef.current = setTimeout(() => setError(""), FEEDBACK_TIMEOUT_MS);
    },
    [clearFeedbackTimer]
  );

  useEffect(() => () => clearFeedbackTimer(), [clearFeedbackTimer]);

  const loadData = useCallback(async () => {
    clearFeedback();

    const requests = [
      { key: "productos", run: () => axios.get(`${apiUrl}/api/admin/products`, authConfig) },
      { key: "clientes", run: () => axios.get(`${apiUrl}/api/admin/users`, authConfig) },
      { key: "ventas", run: () => axios.get(`${apiUrl}/api/admin/orders`, authConfig) },
      { key: "noticias", run: () => axios.get(`${apiUrl}/api/admin/news`, authConfig) },
      { key: "contactos", run: () => axios.get(`${apiUrl}/api/admin/contacts`, authConfig) },
    ];

    const results = await Promise.allSettled(requests.map((r) => r.run()));
    const failed = [];

    results.forEach((result, index) => {
      const key = requests[index].key;
      if (result.status === "fulfilled") {
        const data = result.value.data || [];
        if (key === "productos") setProducts(data);
        if (key === "clientes") setUsers(data);
        if (key === "ventas") setOrders(data);
        if (key === "noticias") setNews(data);
        if (key === "contactos") setContacts(data);
      } else {
        const status = result.reason?.response?.status;
        const backendMsg = result.reason?.response?.data?.msg;
        const detail = backendMsg || (status ? `error ${status}` : "sin respuesta");
        failed.push(`${key}: ${detail}`);
      }
    });

    if (failed.length > 0) {
      showError(`No se pudo cargar: ${failed.join(" | ")}`);
    }
  }, [apiUrl, authConfig, clearFeedback, showError]);

  useEffect(() => {
    if (token) loadData();
  }, [token, loadData]);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    clearFeedback();
    try {
      if (editingProductId) {
        await axios.put(
          `${apiUrl}/api/admin/products/${editingProductId}`,
          {
            ...productForm,
            precio: Number(productForm.precio),
            stock: Number(productForm.stock),
            ordenCatalogo: Number(productForm.ordenCatalogo || 0),
          },
          authConfig
        );
        showMessage("Producto actualizado.");
      } else {
        await axios.post(
          `${apiUrl}/api/admin/products`,
          {
            ...productForm,
            precio: Number(productForm.precio),
            stock: Number(productForm.stock),
            ordenCatalogo: Number(productForm.ordenCatalogo || 0),
          },
          authConfig
        );
        showMessage("Producto creado.");
      }
      setProductForm(initialProduct);
      setEditingProductId("");
      loadData();
    } catch (err) {
      showError(err.response?.data?.msg || "Error al guardar producto");
    }
  };

  const startEditProduct = (p) => {
    setEditingProductId(p._id);
    setProductForm({
      nombre: p.nombre || "",
      descripcion: p.descripcion || "",
      precio: p.precio ?? "",
      imagen: p.imagen || "",
      stock: p.stock ?? "",
      categoria: p.categoria || "",
      activo: p.activo ?? true,
      ordenCatalogo: p.ordenCatalogo ?? 0,
    });
    setActiveTab("productos");
  };

  const deleteProduct = async (id) => {
    clearFeedback();
    try {
      await axios.delete(`${apiUrl}/api/admin/products/${id}`, authConfig);
      showMessage("Producto eliminado.");
      loadData();
    } catch {
      showError("No se pudo eliminar el producto");
    }
  };

  const saveUser = async (id) => {
    clearFeedback();
    try {
      await axios.put(`${apiUrl}/api/admin/users/${id}`, editingUser[id], authConfig);
      showMessage("Cliente actualizado.");
      loadData();
    } catch (err) {
      showError(err.response?.data?.msg || "Error al actualizar cliente");
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    clearFeedback();
    try {
      const payload = {
        ...newUserForm,
        nombre: newUserForm.nombre.trim(),
        email: newUserForm.email.trim().toLowerCase(),
      };
      await axios.post(`${apiUrl}/api/admin/users`, payload, authConfig);
      showMessage("Usuario creado.");
      setNewUserForm(initialUser);
      loadData();
    } catch (err) {
      showError(err.response?.data?.msg || "No se pudo crear usuario");
    }
  };

  const deleteUser = async (id) => {
    clearFeedback();
    if (!window.confirm("¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.")) {
      return;
    }
    try {
      await axios.delete(`${apiUrl}/api/admin/users/${id}`, authConfig);
      showMessage("Usuario eliminado.");
      loadData();
    } catch (err) {
      showError(err.response?.data?.msg || "No se pudo eliminar usuario");
    }
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    clearFeedback();
    try {
      if (editingNewsId) {
        await axios.put(`${apiUrl}/api/admin/news/${editingNewsId}`, newsForm, authConfig);
        showMessage("Noticia actualizada.");
      } else {
        await axios.post(`${apiUrl}/api/admin/news`, newsForm, authConfig);
        showMessage("Noticia publicada.");
      }
      setNewsForm(initialNews);
      setEditingNewsId("");
      loadData();
    } catch {
      showError("No se pudo guardar la noticia");
    }
  };

  const startEditNews = (item) => {
    setEditingNewsId(item._id);
    setNewsForm({
      titulo: item.titulo || "",
      contenido: item.contenido || "",
      imagen: item.imagen || "",
      publicada: !!item.publicada,
    });
    setActiveTab("noticias");
  };

  const deleteNews = async (id) => {
    clearFeedback();
    if (!window.confirm("¿Eliminar esta noticia?")) return;
    try {
      await axios.delete(`${apiUrl}/api/admin/news/${id}`, authConfig);
      showMessage("Noticia eliminada.");
      loadData();
    } catch {
      showError("No se pudo eliminar la noticia");
    }
  };

  const saveContact = async (id) => {
    clearFeedback();
    try {
      await axios.put(`${apiUrl}/api/admin/contacts/${id}`, editingContact[id], authConfig);
      showMessage("Contacto actualizado.");
      loadData();
    } catch {
      showError("No se pudo actualizar el contacto");
    }
  };

  const exportOrders = async () => {
    clearFeedback();
    try {
      const res = await axios.get(`${apiUrl}/api/admin/orders-export`, {
        ...authConfig,
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reporte-ventas-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      showMessage("Reporte exportado.");
    } catch {
      showError("No se pudo exportar el reporte de ventas");
    }
  };

  const deleteDeliveredOrder = async (order) => {
    clearFeedback();
    if (order.estado !== "entregado") {
      showError("Solo se pueden eliminar ventas con estado entregado.");
      return;
    }
    if (!window.confirm(`¿Eliminar la venta ${getOrderCode(order)}?`)) return;
    try {
      await axios.delete(`${apiUrl}/api/admin/orders/${order._id}`, authConfig);
      showMessage("Venta eliminada.");
      loadData();
    } catch (err) {
      showError(err.response?.data?.msg || "No se pudo eliminar la venta");
    }
  };

  return (
    <section className="admin-page">
      <h1>Panel administrador</h1>
      <p className="admin-intro">
        Gestiona catalogo, clientes, ventas y noticias desde una sola vista.
      </p>

      <div className="admin-tabs">
        {["productos", "clientes", "ventas", "noticias", "contactos"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "is-active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {message ? <p className="admin-msg-ok">{message}</p> : null}
      {error ? <p className="admin-msg-error">{error}</p> : null}

      {activeTab === "productos" ? (
        <div className="admin-grid">
          <form className="admin-card" onSubmit={handleProductSubmit}>
            <h2>{editingProductId ? "Editar producto" : "Nuevo producto"}</h2>
            <input
              placeholder="Nombre"
              value={productForm.nombre}
              onChange={(e) => setProductForm({ ...productForm, nombre: e.target.value })}
              required
            />
            <textarea
              placeholder="Descripcion"
              value={productForm.descripcion}
              onChange={(e) => setProductForm({ ...productForm, descripcion: e.target.value })}
              required
            />
            <input
              placeholder="Precio"
              type="number"
              min="50"
              value={productForm.precio}
              onChange={(e) => setProductForm({ ...productForm, precio: e.target.value })}
              required
            />
            <input
              placeholder="Imagen URL"
              value={productForm.imagen}
              onChange={(e) => setProductForm({ ...productForm, imagen: e.target.value })}
              required
            />
            <input
              placeholder="Stock"
              type="number"
              min="0"
              value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              required
            />
            <input
              placeholder="Categoria"
              value={productForm.categoria}
              onChange={(e) => setProductForm({ ...productForm, categoria: e.target.value })}
              required
            />
            <input
              placeholder="Orden en catálogo (0,1,2...)"
              type="number"
              min="0"
              value={productForm.ordenCatalogo}
              onChange={(e) =>
                setProductForm({ ...productForm, ordenCatalogo: e.target.value })
              }
            />
            <label className="admin-check">
              <input
                type="checkbox"
                checked={!!productForm.activo}
                onChange={(e) =>
                  setProductForm({ ...productForm, activo: e.target.checked })
                }
              />
              Visible en catálogo
            </label>
            <button type="submit">{editingProductId ? "Guardar cambios" : "Crear producto"}</button>
          </form>

          <div className="admin-card">
            <h2>Catalogo actual</h2>
            <ul className="admin-list">
              {products.map((p) => (
                <li key={p._id}>
                  <div>
                    <strong>{p.nombre}</strong>
                    <span>
                      ${Number(p.precio || 0).toLocaleString("es-CL")} - stock {p.stock ?? 0}
                      {" · "}orden {p.ordenCatalogo ?? 0}
                      {" · "}{p.activo ? "visible" : "oculto"}
                    </span>
                  </div>
                  <div className="admin-actions">
                    <button type="button" onClick={() => startEditProduct(p)}>
                      Editar
                    </button>
                    <button type="button" className="danger" onClick={() => deleteProduct(p._id)}>
                      Eliminar
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        clearFeedback();
                        try {
                          await axios.put(
                            `${apiUrl}/api/admin/products/${p._id}`,
                            { activo: !p.activo },
                            authConfig
                          );
                          showMessage(
                            p.activo ? "Producto ocultado." : "Producto visible en catálogo."
                          );
                          loadData();
                        } catch {
                          showError("No se pudo cambiar visibilidad del producto");
                        }
                      }}
                    >
                      {p.activo ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {activeTab === "clientes" ? (
        <div className="admin-grid">
          <form className="admin-card" onSubmit={createUser}>
            <h2>Crear usuario</h2>
            <input
              placeholder="Nombre"
              value={newUserForm.nombre}
              onChange={(e) => setNewUserForm({ ...newUserForm, nombre: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUserForm.email}
              onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUserForm.password}
              onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
              required
              minLength={6}
            />
            <select
              value={newUserForm.rol}
              onChange={(e) => setNewUserForm({ ...newUserForm, rol: e.target.value })}
            >
              <option value="cliente">cliente</option>
              <option value="admin">admin</option>
            </select>
            <button type="submit">Crear usuario</button>
          </form>

          <div className="admin-card">
            <h2>Clientes</h2>
            <ul className="admin-list">
              {users.map((u) => (
                <li key={u._id}>
                  <div className="admin-user-fields">
                    <input
                      value={editingUser[u._id]?.nombre ?? u.nombre}
                      onChange={(e) =>
                        setEditingUser((prev) => ({
                          ...prev,
                          [u._id]: { ...prev[u._id], nombre: e.target.value },
                        }))
                      }
                    />
                    <input
                      value={editingUser[u._id]?.email ?? u.email}
                      onChange={(e) =>
                        setEditingUser((prev) => ({
                          ...prev,
                          [u._id]: { ...prev[u._id], email: e.target.value },
                        }))
                      }
                    />
                    <select
                      value={editingUser[u._id]?.rol ?? u.rol}
                      onChange={(e) =>
                        setEditingUser((prev) => ({
                          ...prev,
                          [u._id]: { ...prev[u._id], rol: e.target.value },
                        }))
                      }
                    >
                      <option value="cliente">cliente</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>
                  <div className="admin-actions">
                    <button type="button" onClick={() => saveUser(u._id)}>
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => deleteUser(u._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {activeTab === "ventas" ? (
        <div className="admin-card">
          <h2>Ventas y contacto cliente</h2>
          <div className="admin-actions">
            <button type="button" className="admin-export-link" onClick={exportOrders}>
              Exportar reporte (Excel/CSV)
            </button>
          </div>
          <ul className="admin-list">
            {orders.map((o) => (
              <li key={o._id} className="admin-order-item">
                <div>
                  <strong>
                    Pedido {getOrderCode(o)}
                  </strong>
                  <span>
                    {new Date(o.createdAt).toLocaleString("es-CL")} - {o.user?.nombre || "Cliente"} - $
                    {Number(o.total || 0).toLocaleString("es-CL")} - {o.estado}
                  </span>
                  <span>
                    Procesado por: {o.actualizadoPorNombre || "Sin asignar"}
                  </span>
                </div>
                <div className="admin-order-controls">
                  <Link className="admin-order-detail-link" to={`/ventas/${o._id}`}>
                    Ver / procesar venta
                  </Link>
                  {o.estado === "entregado" ? (
                    <button
                      type="button"
                      className="danger"
                      onClick={() => deleteDeliveredOrder(o)}
                    >
                      Eliminar venta entregada
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {activeTab === "noticias" ? (
        <div className="admin-grid">
          <form className="admin-card" onSubmit={handleNewsSubmit}>
            <h2>{editingNewsId ? "Editar noticia" : "Publicar noticia"}</h2>
            <input
              placeholder="Titulo"
              value={newsForm.titulo}
              onChange={(e) => setNewsForm({ ...newsForm, titulo: e.target.value })}
              required
            />
            <textarea
              placeholder="Contenido"
              value={newsForm.contenido}
              onChange={(e) => setNewsForm({ ...newsForm, contenido: e.target.value })}
              required
            />
            <input
              placeholder="Imagen URL"
              value={newsForm.imagen}
              onChange={(e) => setNewsForm({ ...newsForm, imagen: e.target.value })}
            />
            <label className="admin-check">
              <input
                type="checkbox"
                checked={newsForm.publicada}
                onChange={(e) => setNewsForm({ ...newsForm, publicada: e.target.checked })}
              />
              Publicada
            </label>
            <button type="submit">{editingNewsId ? "Guardar cambios" : "Publicar"}</button>
          </form>

          <div className="admin-card">
            <h2>Noticias</h2>
            <ul className="admin-list">
              {news.map((n) => (
                <li key={n._id}>
                  <div>
                    <strong>{n.titulo}</strong>
                    <span>{n.publicada ? "Publicada" : "Borrador"}</span>
                  </div>
                  <div className="admin-actions">
                    <button type="button" onClick={() => startEditNews(n)}>
                      Editar
                    </button>
                    <button type="button" className="danger" onClick={() => deleteNews(n._id)}>
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {activeTab === "contactos" ? (
        <div className="admin-card">
          <h2>Mensajes de contacto</h2>
          <ul className="admin-list">
            {contacts.map((c) => (
              <li key={c._id}>
                <div>
                  <strong>
                    {c.nombre} ({c.email})
                  </strong>
                  <span>{new Date(c.createdAt).toLocaleString("es-CL")}</span>
                  <p>{c.mensaje}</p>
                </div>
                <div className="admin-order-controls">
                  <select
                    value={editingContact[c._id]?.estado ?? c.estado}
                    onChange={(e) =>
                      setEditingContact((prev) => ({
                        ...prev,
                        [c._id]: { ...prev[c._id], estado: e.target.value },
                      }))
                    }
                  >
                    <option value="nuevo">nuevo</option>
                    <option value="en_revision">en revisión</option>
                    <option value="respondido">respondido</option>
                    <option value="cerrado">cerrado</option>
                  </select>
                  <input
                    placeholder="Respuesta/nota"
                    value={editingContact[c._id]?.respuestaAdmin ?? c.respuestaAdmin ?? ""}
                    onChange={(e) =>
                      setEditingContact((prev) => ({
                        ...prev,
                        [c._id]: { ...prev[c._id], respuestaAdmin: e.target.value },
                      }))
                    }
                  />
                  <button type="button" onClick={() => saveContact(c._id)}>
                    Guardar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
};

export default Admin;
