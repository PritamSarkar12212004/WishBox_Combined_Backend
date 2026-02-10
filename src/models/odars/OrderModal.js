import mongoose from "mongoose";

/* ===== ORDER ITEM SNAPSHOT ===== */
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    title: String,
    price: Number,
    quantity: Number,
    image: {
      url: String,
      public_id: String,
    },
  },
  { _id: false },
);

/* ===== ADDRESS SNAPSHOT ===== */
const orderAddressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: "India",
    },
  },
  { _id: false },
);

/* ===== PAYMENT INFO ===== */
const paymentSchema = new mongoose.Schema(
  {
    paymentType: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    transactionId: String,
    paymentGateway: String, // Razorpay / Stripe
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    paidAt: Date,
  },
  { _id: false },
);

/* ===== ORDER SCHEMA ===== */
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    shippingAddress: orderAddressSchema,

    totalAmount: {
      type: Number,
      required: true,
    },

    payment: paymentSchema,

    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true }, // createdAt = order date
);

export default mongoose.model("Order", orderSchema);
