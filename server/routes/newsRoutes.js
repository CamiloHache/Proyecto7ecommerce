const express = require("express");
const router = express.Router();
const News = require("../models/news");

router.get("/", async (req, res) => {
  try {
    const news = await News.find({ publicada: true }).sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener noticias" });
  }
});

module.exports = router;
