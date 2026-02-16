const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// GET todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos" });
    }
});

// GET producto por id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(product);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de producto no válido" });
        }
        res.status(500).json({ message: "Error al obtener el producto" });
    }
});

// POST crear producto
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: "Error al crear el producto", error });
    }
});

// PUT actualizar producto por id
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(updatedProduct);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "ID de producto no válido" });
        }
        res.status(400).json({ message: "Error al actualizar el producto", error });
    }
});

// DELETE eliminar producto por id
router.delete('/:id', async (req, res) => {
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