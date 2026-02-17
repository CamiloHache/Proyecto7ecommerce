import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/cartContext"; 
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  if (!product) return null;

  return (
    <article className="product-card">
      <Link
        to={`/productos/${product._id}`}
        className="product-card-link"
      >
        <img
          src={product.imagen}
          alt={product.nombre}
          className="product-card-image"
        />
        <h3 className="product-card-title">{product.nombre}</h3>
        <p className="product-card-price">${product.precio?.toLocaleString()}</p>
        <p className="product-card-description">
          {product.descripcion || "Objeto de memoria y cultura."}
        </p>
      </Link>

      <button 
        onClick={() => {
          addToCart(product);
          alert(`${product.nombre} agregado al carrito 🛒`);
        }}
        className="product-card-add-btn"
      >
        Añadir al carrito
      </button>
    </article>
  );
};

export default ProductCard;