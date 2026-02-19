import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Prensa.css";

const getNewsExcerpt = (text) => {
  const raw = String(text || "").replace(/\s+/g, " ").trim();
  if (!raw) return "Sin contenido disponible.";
  return raw.length > 170 ? `${raw.slice(0, 170)}...` : raw;
};

const Prensa = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:4000",
    []
  );

  useEffect(() => {
    const getNews = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${apiUrl}/api/news`);
        setNews(res.data || []);
      } catch {
        setError("No fue posible cargar la sección de prensa.");
      } finally {
        setLoading(false);
      }
    };
    getNews();
  }, [apiUrl]);

  return (
    <section className="press-page">
      <h1>Prensa</h1>
      <p className="press-intro">
        Noticias y comunicados publicados por el equipo administrador.
      </p>

      {loading ? <p>Cargando noticias...</p> : null}
      {error ? <p className="press-error">{error}</p> : null}

      {!loading && !error ? (
        <div className="press-grid">
          {news.length === 0 ? (
            <p>Aun no hay noticias publicadas.</p>
          ) : (
            news.map((item) => (
              <article key={item._id} className="press-card">
                <Link to={`/prensa/${item._id}`} className="press-card-media-link">
                  {item.imagen ? <img src={item.imagen} alt={item.titulo} /> : null}
                </Link>
                <div className="press-card-content">
                  <h2>
                    <Link to={`/prensa/${item._id}`}>{item.titulo}</Link>
                  </h2>
                  <p className="press-date">
                    {new Date(item.createdAt).toLocaleDateString("es-CL")}
                  </p>
                  <p className="press-content">{getNewsExcerpt(item.contenido)}</p>
                  <Link className="press-read-more" to={`/prensa/${item._id}`}>
                    Leer noticia completa
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      ) : null}
    </section>
  );
};

export default Prensa;
