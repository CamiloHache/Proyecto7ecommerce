const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    telefono: { type: String, default: "" },
    mensaje: { type: String, required: true, trim: true },
    estado: {
      type: String,
      enum: ["nuevo", "en_revision", "respondido", "cerrado"],
      default: "nuevo",
    },
    respuestaAdmin: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
