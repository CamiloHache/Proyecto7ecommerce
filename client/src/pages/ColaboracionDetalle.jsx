import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import "./ColaboracionDetalle.css";

const collabData = {
  mmdh: {
    title: "Colaboración con MMDH",
    summary:
      "Trabajo conjunto con el Museo de la Memoria y los Derechos Humanos para activar piezas gráficas en formatos contemporáneos.",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
    video: "https://www.youtube.com/embed/aqz-KE-bpKQ",
  },
  "sitios-memoria": {
    title: "Colaboración con Sitios de Memoria",
    summary:
      "Vinculación con espacios territoriales para preservar y difundir narrativas locales de memoria y derechos humanos.",
    image:
      "https://images.unsplash.com/photo-1544511916-0148ccdeb877?auto=format&fit=crop&w=1200&q=80",
    video: "https://www.youtube.com/embed/oUFJJNQGwhk",
  },
  argentina: {
    title: "Colaboración con Argentina",
    summary:
      "Intercambio regional de archivos y experiencias gráficas para construir puentes de memoria entre comunidades.",
    image:
      "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1200&q=80",
    video: "https://www.youtube.com/embed/5qap5aO4i9A",
  },
};

const ColaboracionDetalle = () => {
  const { slug } = useParams();
  const content = useMemo(() => collabData[slug], [slug]);

  if (!content) {
    return (
      <section className="colab-page">
        <h1>Colaboración no encontrada</h1>
        <Link to="/" className="colab-back-link">
          Volver al inicio
        </Link>
      </section>
    );
  }

  return (
    <section className="colab-page">
      <div className="colab-header">
        <h1>{content.title}</h1>
        <Link to="/" className="colab-back-link">
          Volver al inicio
        </Link>
      </div>

      <img src={content.image} alt={content.title} className="colab-image" />

      <article className="colab-copy">
        <h2>Resumen</h2>
        <p>{content.summary}</p>
      </article>

      <div className="colab-video-wrap">
        <iframe
          src={content.video}
          title={`Video ${content.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
};

export default ColaboracionDetalle;
