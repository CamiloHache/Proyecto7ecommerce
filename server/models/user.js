const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'],
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, 'El correo es obligatorio'],
        unique: true, 
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: [true, 'La contraseña es obligatoria'],
        minlength: 6
    },
    rol: { 
        type: String, 
        enum: ["cliente", "admin"],
        default: 'cliente' 
    }
}, { 
    timestamps: true // Esto crea automáticamente las fechas de creación y actualización
});

module.exports = mongoose.model('User', userSchema);