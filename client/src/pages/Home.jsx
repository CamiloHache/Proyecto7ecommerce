import { useContext } from "react";
import { Link } from "react-router-dom";
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

const Home = () => {
  const { products, loadingProducts, productsError } = useContext(ProductContext);

  return (
    <>
      <Hero />

      <ProyectoSection icon={proyectoIcon} blocks={proyectoBlocks} />

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