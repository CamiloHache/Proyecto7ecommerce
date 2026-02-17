import { useMemo, useState } from "react";
import axios from "axios";
import "./Contacto.css";

const Contacto = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });
  const [ok, setOk] = useState("");
  const [error, setError] = useState("");
  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:4000",
    []
  );

  const onChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setOk("");
    setError("");
    try {
      await axios.post(`${apiUrl}/api/contact`, form);
      setOk("Tu mensaje fue enviado correctamente. Te contactaremos pronto.");
      setForm({ nombre: "", email: "", telefono: "", mensaje: "" });
    } catch (err) {
      setError(err.response?.data?.msg || "No fue posible enviar el formulario.");
    }
  };

  return (
    <section className="contact-page">
      <h1>Contacto</h1>
      <p className="contact-intro">
        Completa el formulario y nuestro equipo te respondera por correo.
      </p>

      <form className="contact-form" onSubmit={onSubmit}>
        <label htmlFor="contact-nombre">Nombre</label>
        <input
          id="contact-nombre"
          value={form.nombre}
          onChange={(e) => onChange("nombre", e.target.value)}
          required
        />

        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          type="email"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />

        <label htmlFor="contact-telefono">Telefono (opcional)</label>
        <input
          id="contact-telefono"
          value={form.telefono}
          onChange={(e) => onChange("telefono", e.target.value)}
        />

        <label htmlFor="contact-mensaje">Mensaje</label>
        <textarea
          id="contact-mensaje"
          rows={5}
          value={form.mensaje}
          onChange={(e) => onChange("mensaje", e.target.value)}
          required
        />

        <button type="submit">Enviar mensaje</button>
        {ok ? <p className="contact-ok">{ok}</p> : null}
        {error ? <p className="contact-error">{error}</p> : null}
      </form>
    </section>
  );
};

export default Contacto;
