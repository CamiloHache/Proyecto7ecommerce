const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/order');
const { generateOrderCode } = require('../utils/orderCode');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ——— GET /api/checkout/order/:orderId (público) ———
// Devuelve codigoPedido y estado para la página de éxito.
router.get('/order/:orderId', async (req, res) => {
  try {
    const orderId = String(req.params.orderId || '').trim();
    if (!orderId) {
      return res.status(400).json({ msg: 'orderId inválido' });
    }
    const order = await Order.findById(orderId).select('codigoPedido estado').lean();
    if (!order) {
      return res.status(404).json({ msg: 'Pedido no encontrado' });
    }
    return res.json({
      codigoPedido: order.codigoPedido || '',
      estado: order.estado || '',
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ msg: 'Pedido no encontrado' });
    }
    return res.status(500).json({ msg: 'Error al obtener el pedido' });
  }
});

// ——— POST /api/checkout (crear orden en BD y sesión Stripe) ———
router.post('/', auth, async (req, res) => {
  try {
    const frontendUrl =
      req.headers.origin ||
      process.env.FRONTEND_URL ||
      'http://localhost:5173';
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ msg: 'El carrito no puede estar vacío' });
    }

    const lineItems = products.map((product) => {
      const nombreProducto = product.nombre || product.name;
      const precioProducto = Number(product.precio || product.price || 0);
      if (precioProducto < 50) {
        throw new Error(
          `El producto "${nombreProducto}" debe tener un precio mínimo de $50 CLP para Stripe.`
        );
      }
      return {
        price_data: {
          currency: 'clp',
          product_data: { name: nombreProducto },
          unit_amount: precioProducto,
        },
        quantity: product.quantity,
      };
    });

    const orderItems = products.map((product) => ({
      productId: product.id || product._id,
      nombre: product.nombre || product.name || 'Producto',
      imagen: product.imagen || product.image || '',
      precio: Number(product.precio || product.price || 0),
      quantity: Number(product.quantity || 1),
    }));

    const total = orderItems.reduce(
      (acc, item) => acc + item.precio * item.quantity,
      0
    );

    const codigoPedido = await generateOrderCode();

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total,
      codigoPedido,
      estado: 'pendiente',
      medioPago: 'stripe',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${frontendUrl}/success?orderId=${order._id}`,
      cancel_url: `${frontendUrl}/cart`,
      client_reference_id: String(order._id),
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ id: session.id, url: session.url, orderId: order._id, orderCode: order.codigoPedido });
  } catch (error) {
    console.error('Error en checkout:', error);
    res.status(500).json({ error: error.message });
  }
});

// ——— Webhook Stripe (checkout.session.completed) ———
// Debe montarse en index.js con express.raw({ type: 'application/json' }) para verificar firma.
function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) {
    console.error('STRIPE_WEBHOOK_SECRET no configurado');
    return res.status(500).json({ error: 'Webhook no configurado' });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type !== 'checkout.session.completed') {
    return res.json({ received: true });
  }

  const session = event.data.object;
  const orderId = session.client_reference_id;
  if (!orderId) {
    console.error('Webhook checkout.session.completed sin client_reference_id');
    return res.status(400).json({ error: 'client_reference_id faltante' });
  }

  Order.findByIdAndUpdate(
    orderId,
    { estado: 'pagado', stripePaymentStatus: 'paid' },
    { new: true }
  )
    .then((order) => {
      if (!order) {
        console.error('Orden no encontrada para webhook:', orderId);
        return res.status(404).json({ error: 'Orden no encontrada' });
      }
      console.log(`Orden ${order.codigoPedido} marcada como pagada (webhook)`);
      res.json({ received: true });
    })
    .catch((err) => {
      console.error('Error actualizando orden en webhook:', err);
      res.status(500).json({ error: 'Error actualizando orden' });
    });
}

router.handleStripeWebhook = handleStripeWebhook;
module.exports = router;
