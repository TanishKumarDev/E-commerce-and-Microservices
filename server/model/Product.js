import mongoose from "mongoose";

/**
 * Product Schema for the e-commerce application
 * Defines the structure and validation rules for product documents
 * @typedef {Object} ProductSchema
 */
const productSchema = new mongoose.Schema({
  // Title of the product
  title: {
    type: String,
    required: true,
  },
  // Detailed description of the product
  about: {
    type: String, 
    required: true,
  },
  // Available quantity of the product
  stock: {
    type: Number,
    required: true,
  },
  // Price of the product in currency units
  price: {
    type: Number,
    required: true,
  },

  // Array of product images with cloudinary id and url
  images: [
    {
      id: String, // Cloudinary image id
      url: String, // Cloudinary image url
    },
  ],

  // Number of units sold, defaults to 0 for new products
  sold: {
    type: Number,
    default: 0,
  },
  // Product category for classification
  category: {
    type: String,
    required: true,
  },

  // Timestamp when product was created
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Export the Product model compiled from the schema
export const Product = mongoose.model("Product", productSchema);
