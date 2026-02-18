import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { CartContext } from "../../context/cartContext"; 
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { token } = useContext(UserContext);
  const navigate = useNavigate();

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
          if (!token) {
            alert("Para agregar productos al carrito primero debes iniciar sesión.");
            navigate("/login");
            return;
          }
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