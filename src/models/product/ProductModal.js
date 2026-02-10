import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },
    pricing: {
      originalPrice: {
        type: Number,
        required: true,
      },
      salePrice: {
        type: Number,
        required: true,
      },
      totalSaving: {
        type: Number,
        default: 0,
      },
    },

    stock: {
      type: Number,
      default: 0,
    },

    stockStatus: {
      type: String,
      enum: ["in_stock", "out_of_stock"],
      default: "in_stock",
    },

    offers: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    images: {
      primary: [
        {
          url: String,
          public_id: String,
        },
      ],

      lifestyle: [
        {
          url: String,
          public_id: String,
        },
      ],
    },

    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
