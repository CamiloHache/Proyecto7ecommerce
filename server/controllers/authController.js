const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');



exports.registerUser = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "El usuario ya existe" });
        }

        user = new User({
            nombre,
            email,
            password,
            rol: "cliente",
        });

        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        await user.save();

        res.status(201).json({ msg: "Usuario creado correctamente", userId: user._id });

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error al registrar el usuario");
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "El usuario no existe" });
        }

        const passCorrecto = await bcryptjs.compare(password, user.password);
        if (!passCorrecto) {
            return res.status(400).json({ msg: "Contraseña incorrecta" });
        }

        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '2h' },
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
                });
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error en el servidor");
    }
};