const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    contenido: { type: String, required: true, trim: true },
    imagen: { type: String, default: "" },
    publicada: { type: Boolean, default: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);
