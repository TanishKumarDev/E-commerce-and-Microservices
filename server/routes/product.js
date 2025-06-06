import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  updateProductImage,
} from "../controller/product.js";
import { uploadFiles, handleMulterError } from "../middleware/multer.js";

const router = express.Router();

router.post("/product/new", isAuth, uploadFiles, handleMulterError, createProduct);
router.get("/product/all", getAllProducts);
router.get("/product/:id", getSingleProduct);
router.put("/product/:id", isAuth, updateProduct);
router.post("/product/:id", isAuth, uploadFiles, handleMulterError, updateProductImage);

export default router;
