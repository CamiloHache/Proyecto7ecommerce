const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');



exports.registerUser = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        // 1. Verificar si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "El usuario ya existe" });
        }

        // 2. Crear el nuevo usuario
        user = new User({
            nombre,
            email,
            password,
            rol: "cliente",
        });

        // 3. Encriptar la contraseña
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        // 4. Guardar en la base de datos
        await user.save();

        res.status(201).json({ msg: "Usuario creado correctamente", userId: user._id });

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error al registrar el usuario");
    }
};

// Función para Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Revisar si el usuario existe
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "El usuario no existe" });
        }

        // 2. Revisar si la contraseña es correcta
        const passCorrecto = await bcryptjs.compare(password, user.password);
        if (!passCorrecto) {
            return res.status(400).json({ msg: "Contraseña incorrecta" });
        }

        // 3. Si todo es OK, crear el Token (JWT)
        const payload = {
            user: { id: user.id }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Usaremos la clave del archivo .env
            { expiresIn: '2h' },    // El token durará 2 horas
            (error, token) => {
                if (error) throw error;
                res.json({
                    token,
                    user: {
                        id: user._id,
                        nombre: user.nombre,
                        email: user.email,
                        rol: user.rol,
                    },
                }); // Respondemos con token y usuario sin password
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error en el servidor");
    }
};