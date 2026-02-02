import { Link } from "react-router-dom";
import Hero from "../components/Hero/Hero";
import ProyectoSection from "../components/ProyectoSection/ProyectoSection";
import ProductCard from "../components/ProductCard/ProductCard";
import producto1 from "../assets/img/pin-caballito-de-mar1.png";
import producto2 from "../assets/img/pin-logo-no1.png";
import producto3 from "../assets/img/pin-tevito1.png";
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
  return (
    <>
      <Hero />

      <ProyectoSection icon={proyectoIcon} blocks={proyectoBlocks} />

      <section className="home-products">
        <div className="home-products-inner">
          <h2>Productos destacados</h2>
          <div className="products-grid">
            <ProductCard
              image={producto1}
              title="Pin Caballito de mar"
              description="Diseño único, inspirado en la tradición y el oficio."
            />
            <ProductCard
              image={producto2}
              title="Pin Logo NO"
              description="Materiales nobles, pensado para durar."
            />
            <ProductCard
              image={producto3}
              title="Pin Tevito"
              description="Identidad, carácter y expresión visual."
            />
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
