import ProductCard from "../components/ProductCard/ProductCard";
import producto1 from "../assets/img/pin-caballito-de-mar1.png";
import producto2 from "../assets/img/pin-logo-no1.png";
import producto3 from "../assets/img/pin-tevito1.png";
import producto4 from "../assets/img/pin-donde-estan1.png";
import producto5 from "../assets/img/bolso-no1.png";
import producto6 from "../assets/img/pin-lente1.png";
import "./Products.css";

const ProductsPage = () => {
  const products = [
    {
      image: producto1,
      title: "Pin Caballito de mar",
      description: "Diseño único, inspirado en la tradición y el oficio.",
    },
    {
      image: producto2,
      title: "Pin Logo NO",
      description: "Materiales nobles, pensado para durar.",
    },
    {
      image: producto3,
      title: "Pin Tevito",
      description: "Identidad, carácter y expresión visual.",
    },
    {
      image: producto4,
      title: "Pin ¿Dónde están?",
      description: "Memoria y búsqueda. Diseño con sentido.",
    },
    {
      image: producto5,
      title: "Bolso NO",
      description: "Tote artesanal con identidad y memoria.",
    },
    {
      image: producto6,
      title: "Pin Lente",
      description: "Mirada y memoria. Pieza de colección.",
    },
  ];

  return (
    <section className="products-page">
      <div className="products-page-inner">
        <h1>Catálogo de productos</h1>
        <p className="products-page-intro">
          Objetos y diseños que conectan memoria, arte y cultura.
        </p>
        <div className="products-grid">
          {products.map((p, i) => (
            <ProductCard
              key={i}
              image={p.image}
              title={p.title}
              description={p.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
