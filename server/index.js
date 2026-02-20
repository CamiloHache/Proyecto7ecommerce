const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. Importación de Rutas
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const newsRoutes = require('./routes/newsRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// 2. Middlewares
app.use(cors());

// Webhook Stripe necesita body raw para verificar firma (antes de express.json)
const checkoutRoutes = require('./routes/checkoutRoutes');
app.post(
  '/api/checkout/webhook',
  express.raw({ type: 'application/json' }),
  checkoutRoutes.handleStripeWebhook
);

app.use(express.json());

// 3. Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('🛢️ Conexión a la base de datos exitosa'))
    .catch((error) => console.log('Error de conexión:', error));

// 4. Definición de Rutas
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/checkout', checkoutRoutes);

// 5. Ruta de prueba
app.get('/', (req, res) => {
    res.send('🚀 Servidor de MEMORICE funcionando');
});

// 6. Arrancar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});