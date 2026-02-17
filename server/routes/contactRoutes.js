const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");

router.post("/", async (req, res) => {
  try {
    const { nombre, email, telefono, mensaje } = req.body;
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ msg: "Nombre, email y mensaje son obligatorios" });
    }

    const created = await Contact.create({ nombre, email, telefono, mensaje });
    res.status(201).json({ msg: "Mensaje enviado correctamente", id: created._id });
  } catch (error) {
    res.status(500).json({ msg: "No se pudo enviar el mensaje" });
  }
});

module.exports = router;
