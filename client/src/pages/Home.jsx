import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ProductContext } from "../context/productContext"; 
import Hero from "../components/Hero/Hero";
import ProyectoSection from "../components/ProyectoSection/ProyectoSection";
import ProductCard from "../components/ProductCard/ProductCard";
import proyectoIcon from "../assets/img/favicon2.png";
import "./Home.css";

const proyectoBlocks = [
  {
    title: "Definición",
    text: "Crear elementos que conmuevan a diversas generaciones a través de la gráfica chilena generada entre los años 70' durante la Unidad Popular, pasando por la resistencia a la dictadura de los 80' y cerrando con la transición a la democracia a inicios de los 90'.",
  },
  {
    title: "Misión",
    text: "Proyecto Memorice es una iniciativa de diseño que rescata y difunde la gráfica vinculada a la memoria reciente de la política chilena.",
  },
  {
    title: "Visión",
    text: "Mantener vigente la memoria visual de la política chilena en diferentes soportes con sentido.",
  },
  {
    title: "Valores",
    text: "Calidad de la manufactura, investigación interdisciplinar y promoción de los Derechos Humanos.",
  },
];

const getNewsExcerpt = (text) => {
  const raw = String(text || "").replace(/\s+/g, " ").trim();
  if (!raw) return "Lee más en la sección de prensa.";
  return raw.length > 150 ? `${raw.slice(0, 150)}...` : raw;
};

const Home = () => {
  const { products, loadingProducts, productsError } = useContext(ProductContext);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState("");
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:4000",
    []
  );

  useEffect(() => {
    const loadNews = async () => {
      setNewsLoading(true);
      setNewsError("");
      try {
        const res = await axios.get(`${apiUrl}/api/news`);
        const items = Array.isArray(res.data) ? res.data : [];
        setNews(items);
      } catch {
        setNewsError("No fue posible cargar los anuncios por ahora.");
      } finally {
        setNewsLoading(false);
      }
    };
    loadNews();
  }, [apiUrl]);

  useEffect(() => {
    if (!news || news.length < 2) return undefined;
    const interval = setInterval(() => {
      setActiveNewsIndex((prev) => (prev + 1) % news.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [news]);

  useEffect(() => {
    if (!news || news.length === 0) {
      setActiveNewsIndex(0);
      return;
    }
    if (activeNewsIndex > news.length - 1) {
      setActiveNewsIndex(0);
    }
  }, [news, activeNewsIndex]);

  const activeNews = news[activeNewsIndex] || null;
  const goPrevNews = () => {
    if (!news.length) return;
    setActiveNewsIndex((prev) => (prev - 1 + news.length) % news.length);
  };
  const goNextNews = () => {
    if (!news.length) return;
    setActiveNewsIndex((prev) => (prev + 1) % news.length);
  };

  return (
    <>
      <Hero />

      <ProyectoSection icon={proyectoIcon} blocks={proyectoBlocks} />

      <section className="home-news">
        <div className="home-news-inner">
          <div className="home-news-head">
            <h2>Anuncios y eventos</h2>
            <Link to="/prensa" className="home-news-link">
              Ir a prensa
            </Link>
          </div>

          {newsLoading ? <p className="home-news-state">Cargando anuncios...</p> : null}
          {!newsLoading && newsError ? <p className="home-news-state">{newsError}</p> : null}
          {!newsLoading && !newsError && !activeNews ? (
            <p className="home-news-state">Aún no hay noticias publicadas.</p>
          ) : null}

          {!newsLoading && !newsError && activeNews ? (
            <article className="home-news-card">
              <Link to="/prensa" className="home-news-card-link" aria-label={`Ir a prensa: ${activeNews.titulo}`}>
                {activeNews.imagen ? (
                  <img src={activeNews.imagen} alt={activeNews.titulo} className="home-news-image" />
                ) : null}

                <div className="home-news-content">
                  <p className="home-news-date">
                    {new Date(activeNews.createdAt).toLocaleDateString("es-CL")}
                  </p>
                  <h3>{activeNews.titulo}</h3>
                  <p className="home-news-excerpt">{getNewsExcerpt(activeNews.contenido)}</p>
                </div>
              </Link>

              {news.length > 1 ? (
                <div className="home-news-controls">
                  <button type="button" onClick={goPrevNews} aria-label="Noticia anterior">
                    Anterior
                  </button>
                  <span>
                    {activeNewsIndex + 1} / {news.length}
                  </span>
                  <button type="button" onClick={goNextNews} aria-label="Siguiente noticia">
                    Siguiente
                  </button>
                </div>
              ) : null}
            </article>
          ) : null}
        </div>
      </section>

      <section className="home-products">
        <div className="home-products-inner">
          <h2>Productos destacados</h2>
          <div className="products-grid">
            {}
            {loadingProducts ? (
              <p className="col-span-full text-center py-10">Cargando productos de memoria...</p>
            ) : productsError ? (
              <p className="col-span-full text-center py-10">{productsError}</p>
            ) : products && products.length > 0 ? (
              products.slice(0, 3).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product} 
                />
              ))
            ) : (
              <p className="col-span-full text-center py-10">No hay productos cargados todavía.</p>
            )}
          </div>
          <Link to="/productos" className="home-products-link">
            Ver todos los productos
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;