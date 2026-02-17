import { useContext, useMemo, useState } from "react";
import { CartContext } from "../context/cartContext";
import { UserContext } from "../context/userContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, totalPrice } = useContext(CartContext);
  const { token, logout } = useContext(UserContext);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:4000",
    []
  );

  const handleCheckout = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setIsProcessingCheckout(true);
      setCheckoutError("");

      const productsPayload = cart.map((item) => ({
        id: item._id,
        nombre: item.nombre,
        name: item.nombre,
        precio: item.precio,
        price: item.precio,
        quantity: item.quantity || 1,
      }));

      const res = await axios.post(
        `${apiUrl}/api/checkout`,
        { products: productsPayload },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      const checkoutUrl = res.data?.url;
      if (!checkoutUrl) {
        setCheckoutError("No se recibió la URL de checkout desde el backend.");
        return;
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      const status = error.response?.status;
      const backendMsg = error.response?.data?.msg || error.response?.data?.error;
      const networkMsg = error.message;

      if (status === 401) {
        logout();
        setCheckoutError(
          "Tu sesión expiró o ya no es válida. Por favor inicia sesión nuevamente para continuar con tu compra."
        );
        navigate("/login");
        return;
      }

      setCheckoutError(
        backendMsg ||
          (status ? `Error ${status} al iniciar checkout.` : null) ||
          networkMsg ||
          "Error al iniciar el checkout."
      );
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <section className="cart-page cart-page-empty">
        <div className="cart-empty-box">
          <h2>Tu carrito está vacío</h2>
          <p>Cuando agregues productos, aparecerán aquí.</p>
          <Link to="/productos" className="cart-empty-link">
            Ir al catálogo
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-inner">
        <h1 className="cart-title">Tu carrito</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-info">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="cart-item-image"
                  />
                  <div className="cart-item-text">
                    <h3>{item.nombre || "Producto"}</h3>
                    <p>Cantidad: {item.quantity}</p>
                  </div>
                </div>

                <div className="cart-item-price">
                  <p>
                    $
                    {(
                      (item.precio || 0) * (item.quantity || 1)
                    ).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="cart-item-remove"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Resumen de compra</h2>

            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>${(totalPrice || 0).toLocaleString()}</span>
            </div>

            <div className="cart-summary-discount">
              <label htmlFor="discount">Código de descuento</label>
              <div className="cart-summary-discount-input">
                <input
                  id="discount"
                  type="text"
                  placeholder="MEMORICE10"
                  disabled
                />
                <button type="button" disabled>
                  Aplicar
                </button>
              </div>
              <p className="cart-summary-discount-note">
                (Los descuentos se habilitarán en la versión completa.)
              </p>
            </div>

            <div className="cart-summary-payments">
              <p>Métodos de pago disponibles:</p>
              <ul>
                <li>Tarjeta de crédito / débito</li>
                <li>Stripe (modo pruebas)</li>
              </ul>
            </div>

            <button
              type="button"
              className="cart-summary-checkout"
              onClick={handleCheckout}
              disabled={isProcessingCheckout}
            >
              {isProcessingCheckout ? "Procesando..." : "Ir a pagar"}
            </button>

            {checkoutError ? (
              <p className="cart-summary-note" style={{ color: "#b91c1c" }}>
                {checkoutError}
              </p>
            ) : (
              <p className="cart-summary-note">
                Serás redirigido a Stripe para completar el pago seguro.
              </p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Cart;