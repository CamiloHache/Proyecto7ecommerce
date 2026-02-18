import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/cartContext";
import { UserContext } from "../context/userContext";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:4000",
    []
  );

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(`${apiUrl}/api/products/${id}`);
        const rawProduct = res.data || {};
        const normalizedProduct = {
          ...rawProduct,
          nombre: rawProduct.nombre ?? rawProduct.name ?? "",
          precio: rawProduct.precio ?? rawProduct.price ?? 0,
          imagen: rawProduct.imagen ?? rawProduct.image ?? "",
          descripcion: rawProduct.descripcion ?? rawProduct.description ?? "",
          categoria: rawProduct.categoria ?? rawProduct.category ?? "",
          stock: rawProduct.stock ?? 0,
        };
        setProduct(normalizedProduct);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Producto no encontrado.");
        } else if (err.response?.status === 400) {
          setError("ID de producto no válido.");
        } else {
          setError("No fue posible cargar el producto.");
        }
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [apiUrl, id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!token) {
      alert("Para agregar productos al carrito primero debes iniciar sesión.");
      navigate("/login");
      return;
    }
    addToCart(product);
    alert(`${product.nombre} agregado al carrito`);
  };

  if (loading) {
    return (
      <section className="product-detail-page">
        <p>Cargando detalle del producto...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="product-detail-page">
        <h1>Detalle de producto</h1>
        <p className="product-detail-error">{error}</p>
        <Link to="/productos" className="product-detail-back-link">
          Volver al catalogo
        </Link>
      </section>
    );
  }

  return (
    <section className="product-detail-page">
      <div className="product-detail-header">
        <h1>{product?.nombre || "Producto sin nombre"}</h1>
        <Link to="/productos" className="product-detail-back-link">
          Volver al catalogo
        </Link>
      </div>

      <div className="product-detail-content">
        <img
          src={product?.imagen}
          alt={product?.nombre || "Producto"}
          className="product-detail-image"
        />

        <div className="product-detail-info">
          <p className="product-detail-price">
            ${Number(product?.precio || 0).toLocaleString("es-CL")}
          </p>
          <p className="product-detail-description">
            {product?.descripcion || "Sin descripción disponible."}
          </p>
          <ul className="product-detail-meta">
            <li>
              <strong>Categoria:</strong> {product?.categoria || "Sin categoria"}
            </li>
          </ul>
          <button
            type="button"
            onClick={handleAddToCart}
            className="product-detail-add-btn"
          >
            Añadir al carrito
          </button>
          <Link to="/productos" className="product-detail-continue-link">
            Seguir comprando
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
