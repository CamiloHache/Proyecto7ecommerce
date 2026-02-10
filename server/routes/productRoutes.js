const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// GET

router.get('/', async (requestAnimationFrame, res) =>{
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos"});
    }
});

//POST

router.post('/', async (req, res)=> {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: "Error al crear el producto", error});
    }
});

module.exports = router