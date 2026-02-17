const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const News = require("../models/news");

router.use(auth, authorizeRole("admin"));

const normalizeProduct = (productDoc) => {
  const p = productDoc?.toObject ? productDoc.toObject() : productDoc;
  return {
    ...p,
    nombre: p?.nombre ?? p?.name ?? "",
    precio: p?.precio ?? p?.price ?? 0,
    imagen: p?.imagen ?? p?.image ?? "",
    descripcion: p?.descripcion ?? p?.description ?? "",
    categoria: p?.categoria ?? p?.category ?? "",
    stock: p?.stock ?? 0,
  };
};

const mapPayloadToProduct = (body = {}) => ({
  nombre: body.nombre ?? body.name,
  descripcion: body.descripcion ?? body.description,
  precio: body.precio ?? body.price,
  imagen: body.imagen ?? body.image,
  stock: body.stock,
  categoria: body.categoria ?? body.category,
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products.map(normalizeProduct));
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const product = new Product(mapPayloadToProduct(req.body));
    const saved = await product.save();
    res.status(201).json(normalizeProduct(saved));
  } catch (error) {
    res.status(400).json({ msg: "Error al crear producto", error: error.message });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, mapPayloadToProduct(req.body), {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    res.json(normalizeProduct(product));
  } catch (error) {
    res.status(400).json({ msg: "Error al actualizar producto", error: error.message });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    res.json({ msg: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar producto" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener usuarios" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { nombre, email, rol } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    if (typeof nombre === "string" && nombre.trim()) user.nombre = nombre.trim();
    if (typeof email === "string" && email.trim()) user.email = email.trim().toLowerCase();
    if (rol && ["cliente", "admin"].includes(rol)) user.rol = rol;

    await user.save();
    res.json({
      msg: "Usuario actualizado",
      user: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ msg: "El correo ya está en uso" });
    }
    res.status(500).json({ msg: "Error al actualizar usuario" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "nombre email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener ventas" });
  }
});

router.put("/orders/:id", async (req, res) => {
  try {
    const { estado, notaContacto } = req.body;
    const updateData = {};
    if (estado) updateData.estado = estado;
    if (typeof notaContacto === "string") updateData.notaContacto = notaContacto;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!order) {
      return res.status(404).json({ msg: "Venta no encontrada" });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ msg: "Error al actualizar venta", error: error.message });
  }
});

router.get("/news", async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener noticias" });
  }
});

router.post("/news", async (req, res) => {
  try {
    const news = new News({ ...req.body, autor: req.user.id });
    const saved = await news.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ msg: "Error al crear noticia", error: error.message });
  }
});

router.put("/news/:id", async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ msg: "Noticia no encontrada" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ msg: "Error al actualizar noticia", error: error.message });
  }
});

router.delete("/news/:id", async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: "Noticia no encontrada" });
    }
    res.json({ msg: "Noticia eliminada" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar noticia" });
  }
});

module.exports = router;
