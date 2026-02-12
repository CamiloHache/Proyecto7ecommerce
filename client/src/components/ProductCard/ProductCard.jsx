import { useContext } from "react";
import { CartContext } from "../../context/cartContext"; // Subimos 2 niveles para llegar al contexto

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  // Seguridad: Si por alguna razón el producto llega vacío, no renderiza nada para no romper la app
  if (!product) return null;

  return (
    <div className="border border-gray-200 rounded-lg shadow-lg p-4 flex flex-col items-center bg-white transition hover:shadow-xl">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-48 object-cover rounded-md mb-4" 
      />
      <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
      <p className="text-gray-600 mb-4">${product.price?.toLocaleString()}</p>
      
      <button 
        onClick={() => {
          addToCart(product);
          alert(`${product.name} agregado al carrito 🛒`);
        }}
        className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
      >
        Añadir al carrito
      </button>
    </div>
  );
};

export default ProductCard;