import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./PrensaDetalle.css";

const PrensaDetalle = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:4000",
    []
  );

  useEffect(() => {
    const loadNewsDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${apiUrl}/api/news`);
        const list = Array.isArray(res.data) ? res.data : [];
        const found = list.find((item) => String(item._id) === String(id));
        if (!found) {
          setError("No encontramos esta noticia.");
          setNewsItem(null);
          return;
        }
        setNewsItem(found);
      } catch {
        setError("No fue posible cargar la noticia.");
      } finally {
        setLoading(false);
      }
    };
    loadNewsDetail();
  }, [apiUrl, id]);

  return (
    <section className="press-detail-page">
      {loading ? <p>Cargando noticia...</p> : null}
      {!loading && error ? <p className="press-detail-error">{error}</p> : null}

      {!loading && !error && newsItem ? (
        <article className="press-detail-card">
          {newsItem.imagen ? <img src={newsItem.imagen} alt={newsItem.titulo} /> : null}
          <div className="press-detail-content">
            <p className="press-detail-date">
              {new Date(newsItem.createdAt).toLocaleDateString("es-CL")}
            </p>
            <h1>{newsItem.titulo}</h1>
            <p className="press-detail-text">{newsItem.contenido}</p>
            <div className="press-detail-actions">
              <Link to="/prensa" className="press-detail-back">
                Volver a prensa
              </Link>
            </div>
          </div>
        </article>
      ) : null}
    </section>
  );
};

export default PrensaDetalle;
