import { Product } from "../model/Product.js";
import TryCatch from "../utils/TryCatch.js";
import bufferGenerator from "../utils/bufferGenerator.js";
import cloudinary from "cloudinary";

/**
 * Create a new product
 * @route POST /api/product/new
 * @access Private (Admin only)
 * @description Creates a new product with multiple images. Images are uploaded to Cloudinary.
 * Required fields: title, about, category, price, stock
 * Required files: At least one image file
 */
export const createProduct = TryCatch(async (req, res) => {
  // Check if user has admin role
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  // Extract product details from request body
  const { title, about, category, price, stock } = req.body;

  // Get uploaded files from multer middleware
  const files = req.files;

  // Validate if files were uploaded
  if (!files || files.length === 0)
    return res.status(400).json({
      message: "no files to upload",
    });

  // Upload each image to Cloudinary and get their URLs
  const imageUploadPromises = files.map(async (file) => {
    // Convert file to buffer for Cloudinary upload
    const fileBuffer = bufferGenerator(file);

    // Upload to Cloudinary and get result
    const result = await cloudinary.v2.uploader.upload(fileBuffer.content);

    // Return image details
    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });

  // Wait for all images to upload
  const uploadedImage = await Promise.all(imageUploadPromises);

  // Create new product in database
  const product = await Product.create({
    title,
    about,
    category,
    price,
    stock,
    images: uploadedImage,
  });

  // Send success response
  res.status(201).json({
    message: "Product Created",
    product,
  });
});

/**
 * Get all products with filtering, sorting, and pagination
 * @route GET /api/product/all
 * @access Public
 * @description Retrieves products with optional filters:
 * - Search by title
 * - Filter by category
 * - Sort by price (low to high or high to low)
 * - Pagination (8 items per page)
 * Also returns:
 * - List of all categories
 * - Latest 4 products
 * - Total number of pages
 */
export const getAllProducts = TryCatch(async (req, res) => {
  // Get query parameters for filtering and sorting
  const { search, category, page, sortByPrice } = req.query;

  // Initialize filter object
  const filter = {};

  // Add search filter if provided (case-insensitive)
  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }

  // Add category filter if provided
  if (category) {
    filter.category = category;
  }

  // Pagination settings
  const limit = 8; // Items per page
  const skip = (page - 1) * limit;

  // Default sort by creation date (newest first)
  let sortOption = { createdAt: -1 };

  // Apply price sorting if requested
  if (sortByPrice) {
    if (sortByPrice === "lowToHigh") {
      sortOption = { price: 1 };
    } else if (sortByPrice === "highToLow") {
      sortOption = { price: -1 };
    }
  }

  // Get paginated products with filters and sorting
  const products = await Product.find(filter)
    .sort(sortOption)
    .limit(limit)
    .skip(skip);

  // Get all unique categories
  const categories = await Product.distinct("category");

  // Get 4 most recent products
  const newProduct = await Product.find().sort("-createdAt").limit(4);

  // Get total product count for pagination
  const countProduct = await Product.countDocuments();
  const totalPages = Math.ceil(countProduct / limit);

  // Send response with all data
  res.json({ products, categories, totalPages, newProduct });
});

/**
 * Get a single product by ID with related products
 * @route GET /api/product/:id
 * @access Public
 * @description Retrieves a single product and 4 related products from the same category
 */
export const getSingleProduct = TryCatch(async (req, res) => {
  // Find product by ID
  const product = await Product.findById(req.params.id);

  // Find 4 related products from same category (excluding current product)
  const relatedProduct = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(4);

  res.json({ product, relatedProduct });
});

/**
 * Update product details
 * @route PUT /api/product/:id
 * @access Private (Admin only)
 * @description Updates product information. Only provided fields will be updated.
 * Allowed fields: title, about, category, price, stock
 */
export const updateProduct = TryCatch(async (req, res) => {
  // Check if user has admin role
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  // Extract update fields from request body
  const { title, about, category, price, stock } = req.body;

  // Create update object with only provided fields
  const updateFields = {};
  if (title) updateFields.title = title;
  if (about) updateFields.about = about;
  if (stock) updateFields.stock = stock;
  if (price) updateFields.price = price;
  if (category) updateFields.category = category;

  // Update product and get updated version
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true, runValidators: true }
  );

  // Check if product exists
  if (!updatedProduct)
    return res.status(404).json({
      message: "Product not found",
    });

  res.json({
    message: "Product Updated",
    updatedProduct,
  });
});

/**
 * Update product images
 * @route POST /api/product/:id
 * @access Private (Admin only)
 * @description Updates product images. Old images are deleted from Cloudinary.
 * Requires at least one new image file.
 */
export const updateProductImage = TryCatch(async (req, res) => {
  // Check if user has admin role
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const { id } = req.params;
  const files = req.files;

  // Validate if files were uploaded
  if (!files || files.length === 0)
    return res.status(400).json({
      message: "no files to upload",
    });

  // Find product
  const product = await Product.findById(id);
  if (!product)
    return res.status(404).json({
      message: "Product not found",
    });

  // Delete old images from Cloudinary
  const oldImages = product.images || [];
  for (const img of oldImages) {
    if (img.id) {
      await cloudinary.v2.uploader.destroy(img.id);
    }
  }

  // Upload new images to Cloudinary
  const imageUploadPromises = files.map(async (file) => {
    const fileBuffer = bufferGenerator(file);
    const result = await cloudinary.v2.uploader.upload(fileBuffer.content);
    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });

  // Wait for all new images to upload
  const uploadedImage = await Promise.all(imageUploadPromises);

  // Update product with new images
  product.images = uploadedImage;
  await product.save();

  res.status(200).json({
    message: "Image updated",
    product,
  });
});
