const Counter = require("../models/counter");

const ORDER_COUNTER_KEY = "orderCode";

const buildOrderCode = (seq) => `SO${String(seq).padStart(4, "0")}`;

const generateOrderCode = async () => {
  const counter = await Counter.findOneAndUpdate(
    { key: ORDER_COUNTER_KEY },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return buildOrderCode(counter.seq);
};

module.exports = {
  generateOrderCode,
  buildOrderCode,
};
