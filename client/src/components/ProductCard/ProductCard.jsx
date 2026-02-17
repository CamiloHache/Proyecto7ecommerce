import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/cartContext"; 

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  if (!product) return null;

  return (
    <div className="border border-gray-200 rounded-lg shadow-lg p-4 flex flex-col items-center bg-white transition hover:shadow-xl">
      <Link
        to={`/productos/${product._id}`}
        className="w-full text-center no-underline"
      >
        <img
          src={product.imagen}
          alt={product.nombre}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-bold text-gray-800">{product.nombre}</h3>
        <p className="text-gray-600 mb-4">${product.precio?.toLocaleString()}</p>
      </Link>

      <button 
        onClick={() => {
          addToCart(product);
          alert(`${product.nombre} agregado al carrito 🛒`);
        }}
        className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
      >
        Añadir al carrito
      </button>
    </div>
  );
};

export default ProductCard;