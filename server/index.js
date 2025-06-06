import express from "express";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import cloudinary from "cloudinary";
import productRoutes from "./routes/product.js";

dotenv.config();

// cloudinary config 
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const app = express();

const PORT = process.env.PORT || 3000;

// using middleware to parse json - always use this before routes; because we are using json in the body of the request
app.use(express.json());

// using routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);


// connect to db
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});


