import mongoose from "mongoose";
import User from "../models/userModels.js";
import Product from "../models/productModels.js";

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      required: true,
    },
    qty: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { timestamps: true },
);

/** @type {mongoose.Model} */

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
