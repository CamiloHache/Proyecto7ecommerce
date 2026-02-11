import { useContext } from "react";
import { CartContext } from "../context/cartContext";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

// Tu clave pública ya está aquí
const stripePromise = loadStripe("pk_test_51SzhWbENkSuzf0bw3fEd0wQxIuBbGGWampgmezI6DN56AGWcX5FuwV7tVJgDz5YwnaxgGMZdSThJ7ixxJjQH55xJ00cLSRL3Qj");

const Cart = () => {
    const { cart, removeFromCart, totalPrice } = useContext(CartContext);

    // Función para manejar el pago
    const handleCheckout = async () => {
        try {
            const stripe = await stripePromise;
            
            // Enviamos el carrito al backend para crear la sesión de Stripe
            const res = await axios.post("http://localhost:4000/api/checkout", {
                products: cart,
            });

            const session = res.data;

            // Redirigimos a la página segura de Stripe
            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (result.error) {
                alert(result.error.message);
            }
        } catch (error) {
            console.error("Error en el checkout:", error);
            alert("Hubo un error al conectar con Stripe. Revisa que tu servidor esté corriendo.");
        }
    };

    if (cart.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold">Tu carrito está vacío</h2>
                <Link to="/" className="text-blue-600 hover:underline mt-4 block">Volver a la tienda</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de Productos */}
                <div className="lg:col-span-2">
                    {cart.map((item) => (
                        <div key={item._id} className="flex items-center justify-between border-b py-4">
                            <div className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                <div>
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <p className="text-gray-600">Cantidad: {item.quantity}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="font-bold text-xl">${(item.price * item.quantity).toLocaleString()}</p>
                                <button 
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-red-500 text-sm mt-2 hover:underline"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Resumen de Compra */}
                <div className="bg-gray-50 p-6 rounded-lg h-fit shadow-md">
                    <h2 className="text-xl font-bold mb-4">Resumen</h2>
                    <div className="flex justify-between mb-4 border-b pb-2">
                        <span>Total:</span>
                        <span className="text-2xl font-bold">${totalPrice.toLocaleString()}</span>
                    </div>
                    {/* Aquí conectamos la función al botón */}
                    <button 
                        onClick={handleCheckout}
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
                    >
                        Ir a pagar con Stripe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;