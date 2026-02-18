const mongoose = require("mongoose");

const buildCommercialCode = () => `SO${String(Date.now() % 100000).padStart(5, "0")}`;

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
    codigoPedido: {
      type: String,
      default: buildCommercialCode,
    },
    numeroPedido: {
      type: String,
      required: true,
      unique: true,
      default: () => `M-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    medioPago: {
      type: String,
      enum: ["stripe", "transferencia"],
      default: "stripe",
    },
    estado: {
      type: String,
      enum: ["recibido", "procesado", "entregado", "pendiente", "pagado", "procesando", "enviado", "cancelado"],
      default: "recibido",
    },
    actualizadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    actualizadoPorNombre: { type: String, default: "" },
    stripeSessionId: { type: String, default: "" },
    stripePaymentStatus: { type: String, default: "" },
    notaContacto: { type: String, default: "" },
  },
  { timestamps: true }
);

orderSchema.pre("validate", function applyCommercialCode(next) {
  if (!this.codigoPedido || !String(this.codigoPedido).trim()) {
    this.codigoPedido = buildCommercialCode();
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
