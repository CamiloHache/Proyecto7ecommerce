const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/user");
const Order = require("../models/order");

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener perfil" });
  }
});

router.put("/me", auth, async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    if (typeof nombre === "string" && nombre.trim()) {
      user.nombre = nombre.trim();
    }
    if (typeof email === "string" && email.trim()) {
      user.email = email.trim().toLowerCase();
    }

    await user.save();
    res.json({
      msg: "Perfil actualizado",
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ msg: "El correo ya está en uso" });
    }
    res.status(500).json({ msg: "Error al actualizar perfil" });
  }
});

router.get("/me/orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener pedidos del usuario" });
  }
});

router.get("/me/orders/latest", auth, async (req, res) => {
  try {
    const order = await Order.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    if (!order) {
      return res.status(404).json({ msg: "Aún no registras compras" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener último pedido del usuario" });
  }
});

router.get("/me/orders/by-session/:sessionId", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      user: req.user.id,
      stripeSessionId: req.params.sessionId,
    });
    if (!order) {
      return res.status(404).json({ msg: "Pedido no encontrado para la sesión indicada" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener pedido por sesión" });
  }
});

router.get("/me/orders/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) {
      return res.status(404).json({ msg: "Pedido no encontrado" });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ msg: "Error al obtener el detalle del pedido" });
  }
});

module.exports = router;
