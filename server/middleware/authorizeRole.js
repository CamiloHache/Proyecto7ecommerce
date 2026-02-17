const User = require("../models/user");

module.exports = (...rolesPermitidos) => async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    const user = await User.findById(req.user.id).select("rol");
    if (!user) {
      return res.status(401).json({ msg: "Usuario no válido" });
    }

    if (!rolesPermitidos.includes(user.rol)) {
      return res.status(403).json({ msg: "No tienes permisos para esta acción" });
    }

    req.userRole = user.rol;
    next();
  } catch (error) {
    res.status(500).json({ msg: "Error al validar permisos" });
  }
};
