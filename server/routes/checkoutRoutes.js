const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/order');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/', auth, async (req, res) => {
    try {
        const frontendUrl =
            req.headers.origin ||
            process.env.FRONTEND_URL ||
            "http://localhost:5173";
        const { products } = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ msg: "El carrito no puede estar vacío" });
        }

        const lineItems = products.map((product) => {
            const nombreProducto = product.nombre || product.name;
            const precioProducto = Number(product.precio || product.price || 0);
            if (precioProducto < 50) {
                throw new Error(`El producto "${nombreProducto}" debe tener un precio mínimo de $50 CLP para Stripe.`);
            }

            return {
                price_data: {
                    currency: 'clp',
                    product_data: {
                        name: nombreProducto,
                    },
                    unit_amount: precioProducto,
                },
                quantity: product.quantity,
            };
        });

        const orderItems = products.map((product) => ({
            productId: product.id || product._id,
            nombre: product.nombre || product.name || "Producto",
            imagen: product.imagen || product.image || "",
            precio: Number(product.precio || product.price || 0),
            quantity: Number(product.quantity || 1),
        }));

        const total = orderItems.reduce(
            (acc, item) => acc + (item.precio * item.quantity),
            0
        );

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            total,
            estado: "recibido",
            medioPago: "stripe",
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}&order_code=${encodeURIComponent(order.codigoPedido || "")}`,
            cancel_url: `${frontendUrl}/cart`,
            metadata: {
                orderId: String(order._id),
                userId: String(req.user.id),
            },
        });

        order.stripeSessionId = session.id;
        await order.save();

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error("Error en Stripe:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;