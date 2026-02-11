const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. Importación de Rutas
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// 2. Middlewares
app.use(cors());
app.use(express.json());

// 3. Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('🛢️ Conexión a la base de datos exitosa'))
    .catch((error) => console.log('Error de conexión:', error));

// 4. Definición de Rutas
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
const checkoutRoutes = require('./routes/checkoutRoutes');

// Usar la ruta
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