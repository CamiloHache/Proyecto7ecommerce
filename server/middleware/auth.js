const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Leer el token del header (lo buscaremos como 'x-auth-token')
    const token = req.header('x-auth-token');

    // 2. Revisar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso no válido' });
    }

    // 3. Validar el token
    try {
        const cifrado = jwt.verify(token, process.env.JWT_SECRET);
        req.user = cifrado.user; // Añadimos el usuario al request
        next(); // Vamos al siguiente paso
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};