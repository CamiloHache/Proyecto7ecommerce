import { useContext } from "react";
import { CartContext } from "../context/cartContext";
import { Link } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart, totalPrice } = useContext(CartContext);

  const handleCheckout = () => {
    alert(
      "Esta es una demo visual. La pasarela de pago se activará cuando el backend esté configurado."
    );
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
            >
              Ir a pagar
            </button>

            <p className="cart-summary-note">
              Esta es una maqueta de demo. El flujo real de pago se conectará al
              backend con Stripe en modo pruebas.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Cart;