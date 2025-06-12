import mongoose from "mongoose";
import dotenv from "dotenv";


// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
        dbName: "Ecommerce",    
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        connectDB();
    }
};

export default connectDB;
// This function connects to the MongoDB database using Mongoose.
// It uses the connection string stored in the environment variable MONGO_URI.