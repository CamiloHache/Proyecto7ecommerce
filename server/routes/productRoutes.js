const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const auth = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

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
        activo: p?.activo ?? true,
        ordenCatalogo: p?.ordenCatalogo ?? 0,
    };
};

const mapPayloadToProduct = (body = {}) => ({
    nombre: body.nombre ?? body.name,
    descripcion: body.descripcion ?? body.description,
    precio: body.precio ?? body.price,
    imagen: body.imagen ?? body.image,
    stock: body.stock,
    categoria: body.categoria ?? body.category,
    activo: typeof body.activo === "boolean" ? body.activo : undefined,
    ordenCatalogo:
        typeof body.ordenCatalogo === "number"
            ? body.ordenCatalogo
            : (body.ordenCatalogo !== undefined ? Number(body.ordenCatalogo) : undefined),
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ activo: true }).sort({ ordenCatalogo: 1, createdAt: -1 });
        res.json(products.map(normalizeProduct));
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, activo: true });

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(normalizeProduct(product));
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de producto no válido" });
        }
        res.status(500).json({ message: "Error al obtener el producto" });
    }
});

router.post('/', auth, authorizeRole("admin"), async (req, res) => {
    try {
        const newProduct = new Product(mapPayloadToProduct(req.body));
        const savedProduct = await newProduct.save();
        res.status(201).json(normalizeProduct(savedProduct));
    } catch (error) {
        res.status(400).json({ message: "Error al crear el producto", error });
    }
});

router.put('/:id', auth, authorizeRole("admin"), async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            mapPayloadToProduct(req.body),
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(normalizeProduct(updatedProduct));
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de producto no válido" });
        }
        res.status(400).json({ message: "Error al actualizar el producto", error });
    }
});

router.delete('/:id', auth, authorizeRole("admin"), async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de producto no válido" });
        }
        res.status(500).json({ message: "Error al eliminar el producto" });
    }
});

module.exports = router