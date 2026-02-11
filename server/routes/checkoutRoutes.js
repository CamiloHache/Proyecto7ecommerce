const express = require('express');
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
    try {
        const { products } = req.body;

        const lineItems = products.map((product) => ({
            price_data: {
                currency: 'clp',
                product_data: {
                    name: product.name,
                },
                unit_amount: product.price,
            },
            quantity: product.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:5173/success',
            cancel_url: 'http://localhost:5173/cart',
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Error en Stripe:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;