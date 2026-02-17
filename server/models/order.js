const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    estado: {
      type: String,
      enum: ["pendiente", "pagado", "procesando", "enviado", "entregado", "cancelado"],
      default: "pendiente",
    },
    stripeSessionId: { type: String, default: "" },
    stripePaymentStatus: { type: String, default: "" },
    notaContacto: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
