const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: 0
    },
    imagen: {
        type: String,
        required: [true, 'La URL de la imagen es obligatorio']
    },
    stock: {
        type: Number,
        default: 10
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria']
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);