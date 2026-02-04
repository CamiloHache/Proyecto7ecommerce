const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);

// Conexión a la base de datos
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('🛢️ Conexión a la base de datos exitosa'))
    .catch((error) => console.log('Error de conexión:', error));

//Ruta de prueba
app.get('/', (req, res) => {
    res.send('🚀 Servidor del Proyecto 7 funcionando');
});

//Arrancar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});