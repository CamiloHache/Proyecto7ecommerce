import { useContext } from "react";
import { CartContext } from "../../context/cartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  // Validación de seguridad: Si no hay producto, no renderizamos nada (o un cargando)
  if (!product) return null;

  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col items-center">
      {/* Usamos el signo ? para que si image no existe, no rompa la app */}
      <img 
        src={product?.image} 
        alt={product?.name} 
        className="w-full h-48 object-cover rounded-md" 
      />
      <h3 className="text-lg font-bold mt-2">{product?.name}</h3>
      <p className="text-gray-600">
        ${product?.price ? product.price.toLocaleString() : "0"}
      </p>
      
      <button 
        onClick={() => {
          addToCart(product);
          alert(`${product.name} añadido al carrito`);
        }}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Añadir al carrito
      </button>
    </div>
  );
};

export default ProductCard;