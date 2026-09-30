import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItem: [],
  totalAmount: {
    type: Number,
    required: true,
  },
  totalQty: {
    type: String,
    required: true,
    min: 1,
  },
  paymentStatus: {
    type: String,
    enum:["success", "faild", "pending"],
    default: "pending",
  },
  delevaryStatus: {
    type: String,
    enum: ["inprogress", "done", "very soon "],
    default:"inprogress",
  },
},
  { timestamps: true },
);
/** @type {mongoose.Model} */

const Order = mongoose.model("Order", orderSchema);

export default Order;
